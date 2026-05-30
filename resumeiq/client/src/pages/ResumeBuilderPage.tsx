import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MinimalistTemplate,
    ModernTemplate,
    ExecutiveTemplate,
    TechMinimalTemplate,
    CreativeTemplate,
    AcademicTemplate,
    SleekSerifTemplate,
    InfographicTemplate,
    EuropeanTemplate,
    MetricEngineerTemplate,
    MatchingCoverLetterTemplate
} from '../components/ui/resume/Templates';
import MagicRewriteButton from '../components/ui/resume/MagicRewriteButton';
import { resumeAPI } from '../services/api';
import { ResumeData } from '../types/resume';
import {
    ChevronLeft,
    ChevronDown,
    Plus,
    Trash2,
    FileDown,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    Eye,
    Linkedin,
    Loader2,
    UploadCloud,
    Sparkles,
    FileText,
    LayoutTemplate,
    X,
    Check
} from 'lucide-react';
import toast from 'react-hot-toast';

type TemplateKey = 'minimalist' | 'modern' | 'executive' | 'tech' | 'creative' | 'academic' | 'serif' | 'infographic' | 'european' | 'metric';
type WorkspaceMode = 'resume' | 'coverLetter';

const TEMPLATES_DATA = [
    { id: 'modern', name: 'Modern', tag: 'ATS GOLD', desc: 'A clean and structured template that fits detailed experience on a single page while remaining easy to read—making it a strong, ATS-friendly choice for many roles.', image: '/image_614ba7.jpg' },
    { id: 'academic', name: 'Ivy League', tag: 'HARVARD', desc: 'A modernized Harvard template featuring a stand-out design and a sophisticated feel. Compact enough to fit a stand-out section like a tailored summary and a strengths section, yet features enough white space.', image: '/image_614c06.jpg' },
    { id: 'serif', name: 'Elegant', tag: 'COLUMN', desc: 'A beautiful template that highlights the strengths & uniqueness of the applicant in a dedicated column, while leaving most of the space for the employment history & education.', image: '/image_614f52.jpg' },
    { id: 'executive', name: 'Polished', tag: 'PREMIUM', desc: 'A stand-out design that looks professional, but also invites the recruiter to spend more time on the resume.', image: '/image_614fce.jpg' },
    { id: 'minimalist', name: 'Single Column', tag: 'OCR RIGID', desc: 'A classic design enhanced to stand out subtly. Highlighted headings improve readability, allowing recruiters to quickly grasp your application and see how you fit the role.', image: '/image_61534c.jpg' },
    { id: 'tech', name: 'Single Column Refined', tag: 'TRADITIONAL', desc: 'A traditional, simple resume template perfect for someone who\'s just starting out their professional career.', image: '/image_61535c.jpg' },
    { id: 'creative', name: 'Creative', tag: 'DESIGN', desc: 'This design accentuates your header in a way that captures recruiters\' attention, encouraging them to explore further. Versatile and adaptable, it\'s suitable for a broad range of industries.', image: '/image_61536c.jpg' },
    { id: 'infographic', name: 'Double Column', tag: 'STRUCTURED', desc: 'The structure and layout of this template are easy to follow, ensuring your application will get more attention than the 20 other resumes waiting for the recruiter to check.', image: '/image_61537c.jpg' },
    { id: 'european', name: 'Elite', tag: 'OPTIMIZED', desc: 'A resume template that features a refined layout that impresses recruiters and an optimized structure for superior ATS performance.', image: '/image_61538c.jpg' },
    { id: 'metric', name: 'Monochrome', tag: 'CLASSIC', desc: 'Perfect choice for job seekers in conservative industries. This template is designed with a professional and classic layout.', image: '/image_61539c.jpg' },
];

export default function ResumeBuilderPage() {
    // --- INITIAL STATES ---
    const [resumeData, setResumeData] = useState<ResumeData>({
        personalInfo: {
            fullName: 'Nagaraj Jakkappa',
            email: 'nagaraj@ncode.io',
            phone: '+91 9876543210',
            location: 'Yadgir, Karnataka',
            linkedin: 'linkedin.com/in/nagaraj'
        },
        summary: 'Detail-oriented Frontend and Python Developer focused on deploying high-fidelity web ecosystems, MERN architectures, and real-time analytical pipeline integrations.',
        experience: [
            {
                company: 'Saiket Systems',
                position: 'Frontend Development Intern',
                startDate: '2025-11',
                endDate: '2026-03',
                current: false,
                description: 'Delivered eight technical application lifecycle parameters.\nOptimized core user journey pipelines with structured React component modules.'
            }
        ],
        education: [
            {
                institution: 'Government Degree College, Yadgir',
                degree: 'BCA',
                fieldOfStudy: 'Computer Applications',
                startDate: '2023',
                endDate: '2026'
            }
        ],
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'MERN Stack', 'Deep Learning', 'Redis']
    });

    const [debouncedResumeData, setDebouncedResumeData] = useState<ResumeData>(resumeData);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedResumeData(resumeData);
        }, 500);
        return () => clearTimeout(timer);
    }, [resumeData]);

    const [activeTemplate, setActiveTemplate] = useState<TemplateKey>('modern');
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [activeMode, setActiveMode] = useState<WorkspaceMode>('resume');
    const [activeSection, setActiveSection] = useState<string>('personal');
    const [exporting, setExporting] = useState(false);
    const [importingLinkedin, setImportingLinkedin] = useState(false);
    const [generatingLetter, setGeneratingLetter] = useState(false);

    // --- COVER LETTER SPECIFIC FORMS STATE ---
    const [targetCompany, setTargetCompany] = useState('GoComet');
    const [targetRole, setTargetRole] = useState('Frontend Engineer');
    const [coverLetterContent, setCoverLetterContent] = useState('');

    const printAreaRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- FORM INPUT CHANGE MUTATION HANDLERS ---
    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [name]: value }
        }));
    };

    const handleExperienceChange = (index: number, field: string, value: any) => {
        setResumeData(prev => {
            const updatedExperience = [...prev.experience];
            updatedExperience[index] = { ...updatedExperience[index], [field]: value };
            return { ...prev, experience: updatedExperience };
        });
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { company: '', position: '', startDate: '', endDate: '', current: false, description: '' }
            ]
        }));
    };

    const removeExperience = (index: number) => {
        if (resumeData.experience.length === 1) return;
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const handleEducationChange = (index: number, field: string, value: string) => {
        setResumeData(prev => {
            const updatedEducation = [...prev.education];
            updatedEducation[index] = { ...updatedEducation[index], [field]: value };
            return { ...prev, education: updatedEducation };
        });
    };

    // --- AI COVER LETTER COMPILATION RUN ---
    const handleGenerateCoverLetter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetCompany || !targetRole) return toast.error('Please configure target enterprise context anchors.');

        setGeneratingLetter(true);
        const loadToast = toast.loading('Assembling custom tailored cover letter narrative loops via Groq...');
        setCoverLetterContent('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/resumes/cover-letter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    resumeData,
                    companyName: targetCompany,
                    jobTitle: targetRole
                })
            });

            if (!response.ok) {
                throw new Error('AI generation pipeline was interrupted.');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');
            let content = '';

            if (reader) {
                toast.success('Receiving tailored narrative...', { id: loadToast });
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunkStr = decoder.decode(value, { stream: true });
                    const lines = chunkStr.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                            try {
                                const parsed = JSON.parse(line.replace('data: ', ''));
                                if (parsed.content) {
                                    content += parsed.content;
                                    setCoverLetterContent(content);
                                }
                            } catch (e) {
                                // Ignore parse errors for incomplete chunks
                            }
                        }
                    }
                }
            }
        } catch (err: any) {
            toast.error(err.message || 'AI generation pipeline was interrupted.', { id: loadToast });
        } finally {
            setGeneratingLetter(false);
        }
    };

    // --- LINKEDIN EXTRACTOR HANDLER ---
    const handleLinkedInUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setImportingLinkedin(true);
        const loadingToast = toast.loading('Extracting data maps from LinkedIn file structure...');

        try {
            const { data } = await resumeAPI.importLinkedIn(formData);
            if (data?.success && data?.data) {
                setResumeData(data.data);
                toast.success('Workspace populated successfully from LinkedIn!', { id: loadingToast });
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'LinkedIn data ingestion aborted.', { id: loadingToast });
        } finally {
            setImportingLinkedin(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // --- NATIVE PDF EXPORT ENGINE ---
    const handleExportPDF = async () => {
        const element = printAreaRef.current;
        if (!element) return toast.error('Render target canvas could not be compiled.');

        setExporting(true);
        const html2pdf = (await import('html2pdf.js')).default;

        const fileLabel = activeMode === 'resume' ? 'Resume' : `CoverLetter_${targetCompany}`;
        const opt = {
            margin: 0,
            filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_${fileLabel}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };

        try {
            await html2pdf().set(opt).from(element).save();
            toast.success('ATS-Friendly PDF compiled successfully!');
        } catch (err) {
            console.error(err);
            toast.error('PDF export engine encountered a runtime issue.');
        } finally {
            setExporting(false);
        }
    };

    const renderSelectedTemplate = () => {
        if (activeMode === 'coverLetter') {
            return (
                <MatchingCoverLetterTemplate
                    data={debouncedResumeData}
                    companyName={targetCompany}
                    jobTitle={targetRole}
                    text={coverLetterContent || "Your customized AI cover letter copy variant will compile inside this canvas element block once triggered."}
                />
            );
        }

        switch (activeTemplate) {
            case 'minimalist': return <MinimalistTemplate data={debouncedResumeData} />;
            case 'modern': return <ModernTemplate data={debouncedResumeData} />;
            case 'executive': return <ExecutiveTemplate data={debouncedResumeData} />;
            case 'tech': return <TechMinimalTemplate data={debouncedResumeData} />;
            case 'creative': return <CreativeTemplate data={debouncedResumeData} />;
            case 'academic': return <AcademicTemplate data={debouncedResumeData} />;
            case 'serif': return <SleekSerifTemplate data={debouncedResumeData} />;
            case 'infographic': return <InfographicTemplate data={debouncedResumeData} />;
            case 'european': return <EuropeanTemplate data={debouncedResumeData} />;
            case 'metric': return <MetricEngineerTemplate data={debouncedResumeData} />;
            default: return <MinimalistTemplate data={debouncedResumeData} />;
        }
    };

    return (
        <div className="flex-1 bg-[#0A0A0F] text-[#EEEEF0] p-6 font-sans">

            {/* Top Controller Header Banner Panel */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#13131A] border border-white/5 p-6 rounded-2xl mb-6 shadow-lg shadow-black/20">
                <div>
                    <Link to="/resumes" className="inline-flex items-center text-gray-500 hover:text-white mb-2 transition-colors text-xs font-bold group">
                        <ChevronLeft className="mr-1 group-hover:-translate-x-0.5 transition-transform" size={14} /> Back to Resumes
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Interactive Design & Content Studio</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Generate highly tailored matching career artifacts instantly.</p>
                </div>

                {/* Global Operational Selection Controllers Row */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Main Module Selection Toggle */}
                    <div className="flex bg-[#0A0A0F] border border-white/10 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveMode('resume')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeMode === 'resume' ? 'bg-[#5B5FEF] text-white shadow-md' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FileText size={13} /> Resume
                        </button>
                        <button
                            onClick={() => setActiveMode('coverLetter')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeMode === 'coverLetter' ? 'bg-[#5B5FEF] text-white shadow-md' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Sparkles size={13} /> Cover Letter
                        </button>
                    </div>

                    {activeMode === 'resume' && (
                        <button
                            onClick={() => setIsTemplateModalOpen(true)}
                            className="flex items-center gap-2 bg-[#1A1A24] hover:bg-white/10 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 text-white cursor-pointer transition-all"
                        >
                            <LayoutTemplate size={14} className="text-[#5B5FEF]" />
                            <span>{TEMPLATES_DATA.find(t => t.id === activeTemplate)?.name || activeTemplate}</span>
                        </button>
                    )}

                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(5,150,105,0.3)] hover:shadow-[0_0_20px_rgba(5,150,105,0.5)]"
                    >
                        {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown size={13} />}
                        {exporting ? 'Compiling PDF...' : 'Export PDF'}
                    </button>
                </div>
            </div>

            {/* Main Structural Dual Splitting Column Config */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN COMPARTMENT FORM CANVAS */}
                <div className="lg:col-span-5 bg-[#13131A] border border-white/5 p-5 rounded-2xl space-y-5 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar shadow-lg shadow-black/20">

                    {activeMode === 'coverLetter' ? (
                        /* --- THE ACTIVE AI COVER LETTER WRITER PANEL FORM --- */
                        <form onSubmit={handleGenerateCoverLetter} className="space-y-4">
                            <div className="bg-gradient-to-br from-[#5B5FEF]/10 to-[#8E5BEF]/10 border border-[#5B5FEF]/20 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B5FEF]/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <h3 className="text-sm font-bold flex items-center gap-2 text-white mb-4 relative z-10">
                                    <Sparkles size={16} className="text-[#5B5FEF]" /> AI Cover Letter Studio
                                </h3>

                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Target Enterprise Company</label>
                                        <input
                                            type="text" value={targetCompany} onChange={e => setTargetCompany(e.target.value)}
                                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF]/50 outline-none transition-all"
                                            placeholder="e.g., Google, Amazon, Startup Inc." required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Target Designation Role</label>
                                        <input
                                            type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)}
                                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF]/50 outline-none transition-all"
                                            placeholder="e.g., Senior Frontend Engineer" required
                                        />
                                    </div>

                                    <button
                                        type="submit" disabled={generatingLetter}
                                        className="w-full flex items-center justify-center gap-2 bg-[#5B5FEF] hover:bg-[#4A4EDF] disabled:bg-slate-800 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(91,95,239,0.4)]"
                                    >
                                        {generatingLetter ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles size={14} />}
                                        {generatingLetter ? 'Assembling Narrative Elements...' : 'Compile Tailored Cover Letter'}
                                    </button>
                                </div>
                            </div>

                            {coverLetterContent && (
                                <div className="mt-6 space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Interactive Copy Sandbox</label>
                                    <textarea
                                        value={coverLetterContent} onChange={e => setCoverLetterContent(e.target.value)}
                                        className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl p-4 text-xs text-gray-300 min-h-[300px] font-sans resize-y leading-relaxed outline-none focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF]/30 transition-all shadow-inner"
                                    />
                                </div>
                            )}
                        </form>
                    ) : (
                        /* --- STANDARD RESUME ENTRY CONTROLLERS FIELDS --- */
                        <div className="space-y-4">
                            {/* LINKEDIN QUICK IMPORT MODULE */}
                            <div className="bg-[#5B5FEF]/10 border border-[#5B5FEF]/20 p-4 rounded-2xl space-y-3 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B5FEF]/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#5B5FEF]/30 transition-all"></div>
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="p-2 bg-[#5B5FEF] text-white rounded-xl shadow-[0_0_15px_rgba(91,95,239,0.5)]">
                                        <Linkedin size={18} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white tracking-wide">Import from LinkedIn</h4>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Upload your "Save to PDF" file to auto-fill the workspace.</p>
                                    </div>
                                </div>
                                <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleLinkedInUpload} className="hidden" />
                                <button
                                    type="button" disabled={importingLinkedin} onClick={() => fileInputRef.current?.click()}
                                    className="w-full relative z-10 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all backdrop-blur-sm"
                                >
                                    {importingLinkedin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud size={14} />}
                                    {importingLinkedin ? 'Extracting Data...' : 'Upload Profile PDF'}
                                </button>
                            </div>

                            {/* ACCORDION: PERSONAL DETAILS */}
                            <div className="border border-white/5 rounded-2xl bg-[#0A0A0F]/30 overflow-hidden transition-all duration-300">
                                <button 
                                    type="button"
                                    onClick={() => setActiveSection(activeSection === 'personal' ? '' : 'personal')}
                                    className="w-full flex justify-between items-center p-4 hover:bg-white/[0.02] transition-colors"
                                >
                                    <h3 className={`text-sm font-bold flex items-center gap-2 ${activeSection === 'personal' ? 'text-blue-400' : 'text-gray-400'}`}>
                                        <User size={16} /> Personal Details
                                    </h3>
                                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeSection === 'personal' ? 'rotate-180 text-blue-400' : 'text-gray-500'}`} />
                                </button>
                                {activeSection === 'personal' && (
                                    <div className="p-4 border-t border-white/5 bg-[#0A0A0F]/50">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                                <input type="text" name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full bg-[#13131A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                                                <input type="email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} className="w-full bg-[#13131A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                                                <input type="text" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full bg-[#13131A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Location</label>
                                                <input type="text" name="location" value={resumeData.personalInfo.location || ''} onChange={handlePersonalInfoChange} className="w-full bg-[#13131A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all" />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">LinkedIn Profile</label>
                                                <input type="text" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange} className="w-full bg-[#13131A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ACCORDION: PROFESSIONAL SUMMARY */}
                            <div className="border border-white/5 rounded-2xl bg-[#0A0A0F]/30 overflow-hidden transition-all duration-300">
                                <button 
                                    type="button"
                                    onClick={() => setActiveSection(activeSection === 'summary' ? '' : 'summary')}
                                    className="w-full flex justify-between items-center p-4 hover:bg-white/[0.02] transition-colors"
                                >
                                    <h3 className={`text-sm font-bold flex items-center gap-2 ${activeSection === 'summary' ? 'text-purple-400' : 'text-gray-400'}`}>
                                        <Briefcase size={16} /> Professional Summary
                                    </h3>
                                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeSection === 'summary' ? 'rotate-180 text-purple-400' : 'text-gray-500'}`} />
                                </button>
                                {activeSection === 'summary' && (
                                    <div className="p-4 border-t border-white/5 bg-[#0A0A0F]/50">
                                        <textarea 
                                            className="w-full bg-[#13131A] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 resize-y font-sans leading-relaxed min-h-[100px] transition-all" 
                                            value={resumeData.summary} 
                                            onChange={e => setResumeData({ ...resumeData, summary: e.target.value })} 
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ACCORDION: WORK EXPERIENCE */}
                            <div className="border border-white/5 rounded-2xl bg-[#0A0A0F]/30 overflow-hidden transition-all duration-300">
                                <button 
                                    type="button"
                                    onClick={() => setActiveSection(activeSection === 'experience' ? '' : 'experience')}
                                    className="w-full flex justify-between items-center p-4 hover:bg-white/[0.02] transition-colors"
                                >
                                    <h3 className={`text-sm font-bold flex items-center gap-2 ${activeSection === 'experience' ? 'text-emerald-400' : 'text-gray-400'}`}>
                                        <Briefcase size={16} /> Work Experience
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addExperience();
                                                setActiveSection('experience');
                                            }} 
                                            className="text-[10px] bg-white/5 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold uppercase border border-white/10 transition-all text-gray-300 hover:text-emerald-400"
                                        >
                                            <Plus size={11} /> Add
                                        </div>
                                        <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeSection === 'experience' ? 'rotate-180 text-emerald-400' : 'text-gray-500'}`} />
                                    </div>
                                </button>
                                {activeSection === 'experience' && (
                                    <div className="p-4 border-t border-white/5 bg-[#0A0A0F]/50 space-y-4">
                                        {resumeData.experience.map((exp, idx) => (
                                            <div key={idx} className="relative p-4 border border-white/5 bg-[#13131A] rounded-xl space-y-4 transition-all hover:border-white/10">
                                                {resumeData.experience.length > 1 && (
                                                    <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors bg-[#0A0A0F] p-1.5 rounded-lg border border-white/5">
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-10">
                                                    <div>
                                                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Role Title</label>
                                                        <input type="text" value={exp.position} onChange={e => handleExperienceChange(idx, 'position', e.target.value)} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Company</label>
                                                        <input type="text" value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Start Date</label>
                                                        <input type="text" value={exp.startDate} onChange={e => handleExperienceChange(idx, 'startDate', e.target.value)} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">End Date</label>
                                                        <input type="text" value={exp.endDate} onChange={e => handleExperienceChange(idx, 'endDate', e.target.value)} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center bg-[#0A0A0F] px-3 py-2 rounded-t-lg border border-white/10 border-b-0">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Achievements & Details</label>
                                                        <MagicRewriteButton currentText={exp.description} jobTitle={exp.position} onRewrite={newText => handleExperienceChange(idx, 'description', newText)} />
                                                    </div>
                                                    <textarea 
                                                        value={exp.description} 
                                                        onChange={e => handleExperienceChange(idx, 'description', e.target.value)} 
                                                        className="w-full bg-[#0A0A0F] border border-white/10 rounded-b-lg p-3 text-xs text-white min-h-[120px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all leading-relaxed" 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ACCORDION: ACADEMIC CREDENTIALS */}
                            <div className="border border-white/5 rounded-2xl bg-[#0A0A0F]/30 overflow-hidden transition-all duration-300">
                                <button 
                                    type="button"
                                    onClick={() => setActiveSection(activeSection === 'education' ? '' : 'education')}
                                    className="w-full flex justify-between items-center p-4 hover:bg-white/[0.02] transition-colors"
                                >
                                    <h3 className={`text-sm font-bold flex items-center gap-2 ${activeSection === 'education' ? 'text-amber-400' : 'text-gray-400'}`}>
                                        <GraduationCap size={16} /> Academic Credentials
                                    </h3>
                                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeSection === 'education' ? 'rotate-180 text-amber-400' : 'text-gray-500'}`} />
                                </button>
                                {activeSection === 'education' && (
                                    <div className="p-4 border-t border-white/5 bg-[#0A0A0F]/50 space-y-3">
                                        {resumeData.education.map((edu, idx) => (
                                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#13131A] border border-white/5 p-4 rounded-xl">
                                                <div>
                                                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Institution Name</label>
                                                    <input type="text" value={edu.institution} onChange={e => handleEducationChange(idx, 'institution', e.target.value)} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all" />
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Degree Type</label>
                                                    <input type="text" value={edu.degree} onChange={e => handleEducationChange(idx, 'degree', e.target.value)} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ACCORDION: CORE COMPETENCIES */}
                            <div className="border border-white/5 rounded-2xl bg-[#0A0A0F]/30 overflow-hidden transition-all duration-300">
                                <button 
                                    type="button"
                                    onClick={() => setActiveSection(activeSection === 'skills' ? '' : 'skills')}
                                    className="w-full flex justify-between items-center p-4 hover:bg-white/[0.02] transition-colors"
                                >
                                    <h3 className={`text-sm font-bold flex items-center gap-2 ${activeSection === 'skills' ? 'text-cyan-400' : 'text-gray-400'}`}>
                                        <Wrench size={16} /> Technical Assets Matrix
                                    </h3>
                                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeSection === 'skills' ? 'rotate-180 text-cyan-400' : 'text-gray-500'}`} />
                                </button>
                                {activeSection === 'skills' && (
                                    <div className="p-4 border-t border-white/5 bg-[#0A0A0F]/50">
                                        <input 
                                            className="w-full bg-[#13131A] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-none font-mono transition-all" 
                                            value={resumeData.skills.join(', ')} 
                                            onChange={e => setResumeData({ ...resumeData, skills: e.target.value.split(',').map(s => s.trim()) })} 
                                            placeholder="React, TypeScript, Node.js..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>

                {/* RIGHT COLUMN VIEWPORT PANE PANEL PREVIEW */}
                <div className="lg:col-span-7 bg-[#1A1A24] rounded-2xl border border-white/5 flex flex-col min-h-[calc(100vh-160px)] overflow-hidden relative shadow-lg shadow-black/20">
                    <div className="flex-shrink-0 w-full flex items-center justify-between p-4 border-b border-white/5 bg-[#13131A] z-10">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-wide uppercase">
                            <Eye size={14} className="text-[#5B5FEF]" />
                            Live Blueprint Render
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar flex justify-center p-8 relative">
                        {/* Blueprint Grid Background Pattern */}
                        <div className="absolute inset-0 pointer-events-none opacity-20" 
                            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                        </div>

                        <div
                            className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-white transform origin-top mx-auto min-w-[210mm] min-h-[297mm] h-max scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 transition-transform duration-300 ring-1 ring-white/10 relative z-10"
                        >
                            <div ref={printAreaRef} className="w-full h-full bg-white text-black">
                                {renderSelectedTemplate()}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* TEMPLATE LIBRARY MODAL */}
            {isTemplateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-[#0A0A0F] border border-white/10 rounded-3xl w-full max-w-[1400px] my-8 relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">

                        <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                            <div>
                                <h2 className="text-2xl font-black text-white">Template Library</h2>
                                <p className="text-sm text-gray-400 mt-1">Select an ATS-friendly layout for your resume.</p>
                            </div>
                            <button
                                onClick={() => setIsTemplateModalOpen(false)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {TEMPLATES_DATA.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => { setActiveTemplate(t.id as TemplateKey); setIsTemplateModalOpen(false); }}
                                        className={`bg-[#13131A] border rounded-3xl p-4 transition-all flex flex-col justify-between group cursor-pointer shadow-xl ${activeTemplate === t.id ? 'border-[#5B5FEF] ring-2 ring-[#5B5FEF]/30 bg-[#5B5FEF]/5' : 'border-white/[0.05] hover:border-[#5B5FEF]/30'}`}
                                    >
                                        <div>
                                            <div className="rounded-xl overflow-hidden border border-white/5 bg-[#1A1A24] aspect-[1/1.414] mb-4 relative flex items-center justify-center">
                                                {t.image ? (
                                                    <img
                                                        src={t.image}
                                                        alt={`${t.name} Template`}
                                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="text-white/10 font-black text-2xl tracking-widest uppercase transform -rotate-45">HYRR</div>
                                                )}

                                                {activeTemplate === t.id && (
                                                    <div className="absolute inset-0 bg-[#5B5FEF]/20 flex items-center justify-center backdrop-blur-[2px]">
                                                        <div className="bg-[#5B5FEF] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
                                                            <Check size={14} /> Active
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between px-1 mb-3">
                                                <h3 className="font-extrabold text-xs text-white truncate mr-2">{t.name}</h3>
                                                <span className="text-[8px] font-black text-[#3DEBA6] uppercase tracking-wider font-mono shrink-0">{t.tag}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 font-mono px-1 leading-relaxed border-t border-white/5 pt-2.5 line-clamp-3">
                                                {t.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const Loader = ({ size, className }: { size: number; className?: string }) => (
    <div className={`border-2 border-current border-t-transparent rounded-full animate-spin ${className}`} style={{ width: size, height: size }} />
);