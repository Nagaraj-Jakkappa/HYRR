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
    Check,
    Copy
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
    const [targetTemplate, setTargetTemplate] = useState('Modern Professional');
    const [jobDescription, setJobDescription] = useState('');
    const [coverLetterContent, setCoverLetterContent] = useState('');
    const [savingLetter, setSavingLetter] = useState(false);
    const [currentCoverLetterId, setCurrentCoverLetterId] = useState<string | null>(null);

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
        setCurrentCoverLetterId(null);
        const loadToast = toast.loading('Assembling custom tailored cover letter narrative loops via Groq...');
        setCoverLetterContent('');

        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const endpoint = apiUrl.replace(/\/api$/, '') + '/api/cover-letters/generate';
            
            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    resumeData,
                    companyName: targetCompany,
                    jobTitle: targetRole,
                    jobDescription,
                    template: targetTemplate
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

    const handleSaveCoverLetter = async () => {
        if (!coverLetterContent) return;
        setSavingLetter(true);
        const toastId = toast.loading('Saving cover letter securely...');
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            
            let url = `${apiUrl.replace(/\/api$/, '')}/api/cover-letters`;
            let method = 'POST';
            
            if (currentCoverLetterId) {
                url = `${url}/${currentCoverLetterId}`;
                method = 'PATCH';
            }

            const res = await fetch(url, {
                method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    companyName: targetCompany,
                    jobTitle: targetRole,
                    jobDescription,
                    template: targetTemplate,
                    content: coverLetterContent
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Failed to save');
            
            if (method === 'POST') {
                setCurrentCoverLetterId(data.data._id);
            }
            toast.success('Cover letter saved successfully.', { id: toastId });
        } catch (err: any) {
            toast.error(err.message, { id: toastId });
        } finally {
            setSavingLetter(false);
        }
    };

    const handleCopyCoverLetter = () => {
        if (!coverLetterContent) return;
        navigator.clipboard.writeText(coverLetterContent);
        toast.success('Copied to clipboard!');
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

                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">1. Select Template</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { id: 'Modern Professional', desc: 'Clean, structured, and standard' },
                                                { id: 'Startup Friendly', desc: 'Bold, enthusiastic, and direct' },
                                                { id: 'ATS Formal', desc: 'Strictly professional and rigid' },
                                                { id: 'Fresher / Internship', desc: 'Focuses on potential and learning' }
                                            ].map(t => (
                                                <div 
                                                    key={t.id} 
                                                    onClick={() => setTargetTemplate(t.id)}
                                                    className={`cursor-pointer border rounded-xl p-3 sm:p-4 transition-all ${targetTemplate === t.id ? 'bg-[#5B5FEF]/10 border-[#5B5FEF] shadow-[inset_0_0_20px_rgba(91,95,239,0.15)]' : 'bg-[#0A0A0F]/40 border-white/5 hover:border-white/20 hover:bg-[#0A0A0F]/60'}`}
                                                >
                                                    <h4 className={`text-[13px] font-bold mb-1 tracking-wide ${targetTemplate === t.id ? 'text-white' : 'text-gray-300'}`}>{t.id}</h4>
                                                    <p className={`text-[11px] font-medium leading-snug ${targetTemplate === t.id ? 'text-[#a25bef]' : 'text-gray-500'}`}>{t.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-white/5">
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 mt-2">2. Target Role Details</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">Company Name <span className="text-[#ef4444]">*</span></label>
                                                <input
                                                    type="text" value={targetCompany} onChange={e => setTargetCompany(e.target.value)}
                                                    className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF]/50 outline-none transition-all hover:border-white/20"
                                                    placeholder="e.g., Acme Corp" required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">Job Title <span className="text-[#ef4444]">*</span></label>
                                                <input
                                                    type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)}
                                                    className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF]/50 outline-none transition-all hover:border-white/20"
                                                    placeholder="e.g., Product Manager" required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Job Description <span className="text-gray-600 font-medium lowercase tracking-normal">(optional but recommended)</span></label>
                                            <textarea
                                                value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                                                className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-4 text-xs text-white min-h-[100px] focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF]/50 outline-none transition-all resize-y hover:border-white/20 leading-relaxed font-sans"
                                                placeholder="Paste key responsibilities or requirements here so the AI can perfectly match your skills..."
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit" disabled={generatingLetter || !targetCompany || !targetRole}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] disabled:from-[#13131A] disabled:to-[#13131A] disabled:text-gray-500 disabled:border disabled:border-white/5 disabled:shadow-none text-white text-sm font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(91,95,239,0.3)] hover:shadow-[0_0_25px_rgba(91,95,239,0.5)] active:scale-[0.99] mt-4 tracking-wide"
                                    >
                                        {generatingLetter ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles size={18} />}
                                        {generatingLetter ? 'Generating Cover Letter...' : 'Generate Cover Letter'}
                                    </button>
                                </div>
                            </div>

                            {coverLetterContent ? (
                                <div className="mt-8 space-y-4 bg-[#13131A] p-5 sm:p-6 rounded-3xl border border-white/5 shadow-2xl relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                            <FileText size={16} className="text-[#3DEBA6]" /> 
                                            Generated Content
                                        </label>
                                        {savingLetter ? (
                                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full"><Loader2 size={12} className="animate-spin" /> Saving...</span>
                                        ) : currentCoverLetterId ? (
                                            <span className="text-[10px] font-bold text-[#3DEBA6] flex items-center gap-1.5 bg-[#3DEBA6]/10 px-3 py-1 rounded-full border border-[#3DEBA6]/20 shadow-[inset_0_0_10px_rgba(61,235,166,0.1)]"><Check size={12} /> Saved to Profile</span>
                                        ) : null}
                                    </div>
                                    <textarea
                                        value={coverLetterContent} onChange={e => setCoverLetterContent(e.target.value)}
                                        className="w-full bg-[#0A0A0F]/80 border border-white/10 rounded-2xl p-5 sm:p-6 text-sm text-gray-200 min-h-[400px] font-serif resize-y leading-relaxed outline-none focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF]/30 transition-all shadow-inner hover:border-white/20 custom-scrollbar"
                                    />
                                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                                        <button
                                            type="button" onClick={handleSaveCoverLetter} disabled={savingLetter || !coverLetterContent}
                                            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-[#5B5FEF]/10 hover:bg-[#5B5FEF]/20 border border-[#5B5FEF]/30 text-[#5B5FEF] text-xs font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                        >
                                            {savingLetter ? <Loader2 className="w-4 h-4 animate-spin" /> : currentCoverLetterId ? <Check size={16} /> : <FileDown size={16} />}
                                            {currentCoverLetterId ? 'Update Saved Profile' : 'Save to Profile'}
                                        </button>
                                        <button
                                            type="button" onClick={handleCopyCoverLetter} disabled={!coverLetterContent}
                                            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                        >
                                            <Copy size={16} className="text-gray-400" />
                                            Copy to Clipboard
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-8 border border-white/5 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-[#0A0A0F]/30 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#5B5FEF]/0 to-[#8E5BEF]/0 group-hover:from-[#5B5FEF]/5 group-hover:to-[#8E5BEF]/5 transition-all duration-500"></div>
                                    <div className="w-16 h-16 bg-white/[0.03] border border-white/5 rounded-full flex items-center justify-center mb-5 relative z-10 shadow-lg">
                                        <FileText className="text-gray-600" size={28} />
                                    </div>
                                    <h4 className="text-sm font-black text-gray-300 mb-2 relative z-10 tracking-wide">No Cover Letter Generated</h4>
                                    <p className="text-xs text-gray-500 max-w-[280px] leading-relaxed relative z-10 font-medium">Fill out the target role details above and click Generate to create a highly tailored, beautifully written cover letter.</p>
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
                                    <div className="p-4 sm:p-6 border-t border-white/5 bg-[#0A0A0F]/50 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Full Name <span className="text-[#ef4444]">*</span></label>
                                                <input type="text" name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., John Doe" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Email Address <span className="text-[#ef4444]">*</span></label>
                                                <input type="email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., john@example.com" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Phone Number <span className="text-[#ef4444]">*</span></label>
                                                <input type="text" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., +1 234 567 8900" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Location <span className="text-[#ef4444]">*</span></label>
                                                <input type="text" name="location" value={resumeData.personalInfo.location || ''} onChange={handlePersonalInfoChange} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., San Francisco, CA" />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">LinkedIn Profile <span className="text-gray-600 font-medium lowercase tracking-normal">(optional)</span></label>
                                                <input type="text" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., linkedin.com/in/johndoe" />
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
                                    <div className="p-4 sm:p-6 border-t border-white/5 bg-[#0A0A0F]/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">Summary Text <span className="text-[#ef4444]">*</span></label>
                                            <MagicRewriteButton currentText={resumeData.summary} jobTitle={resumeData.experience[0]?.position || "Software Engineer"} onRewrite={newText => setResumeData({ ...resumeData, summary: newText })} />
                                        </div>
                                        <textarea 
                                            className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 resize-y font-sans leading-relaxed min-h-[120px] transition-all hover:border-white/20" 
                                            value={resumeData.summary} 
                                            onChange={e => setResumeData({ ...resumeData, summary: e.target.value })} 
                                            placeholder="Write a brief, high-impact summary of your career and goals..."
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
                                    <div className="p-4 sm:p-6 border-t border-white/5 bg-[#0A0A0F]/50 space-y-5">
                                        {resumeData.experience.map((exp, idx) => (
                                            <div key={idx} className="relative p-5 border border-white/5 bg-[#13131A] rounded-2xl space-y-4 transition-all hover:border-white/10 shadow-lg">
                                                {resumeData.experience.length > 1 && (
                                                    <button onClick={() => removeExperience(idx)} className="absolute -top-3 -right-3 text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors bg-[#0A0A0F] p-2 rounded-full border border-white/10 shadow-md z-10 group">
                                                        <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                                                    </button>
                                                )}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Role Title <span className="text-[#ef4444]">*</span></label>
                                                        <input type="text" value={exp.position} onChange={e => handleExperienceChange(idx, 'position', e.target.value)} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., Senior Frontend Engineer" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Company <span className="text-[#ef4444]">*</span></label>
                                                        <input type="text" value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., Acme Corp" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Start Date <span className="text-[#ef4444]">*</span></label>
                                                        <input type="text" value={exp.startDate} onChange={e => handleExperienceChange(idx, 'startDate', e.target.value)} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., Jan 2020" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">End Date <span className="text-gray-600 font-medium lowercase tracking-normal">(or "Present")</span></label>
                                                        <input type="text" value={exp.endDate} onChange={e => handleExperienceChange(idx, 'endDate', e.target.value)} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., Present" />
                                                    </div>
                                                </div>
                                                <div className="space-y-0 pt-2">
                                                    <div className="flex justify-between items-center bg-[#0A0A0F]/50 px-4 py-3 rounded-t-xl border border-white/10 border-b-0">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">Achievements & Details <span className="text-[#ef4444]">*</span></label>
                                                        <MagicRewriteButton currentText={exp.description} jobTitle={exp.position} onRewrite={newText => handleExperienceChange(idx, 'description', newText)} />
                                                    </div>
                                                    <textarea 
                                                        value={exp.description} 
                                                        onChange={e => handleExperienceChange(idx, 'description', e.target.value)} 
                                                        className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-b-xl p-4 text-xs text-white min-h-[140px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all leading-relaxed font-sans resize-y hover:border-white/20" 
                                                        placeholder="Describe your impact, metrics, and technical accomplishments..."
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
                                    <div className="p-4 sm:p-6 border-t border-white/5 bg-[#0A0A0F]/50 space-y-4">
                                        {resumeData.education.map((edu, idx) => (
                                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#13131A] border border-white/5 p-5 rounded-2xl relative shadow-lg">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Institution Name <span className="text-[#ef4444]">*</span></label>
                                                    <input type="text" value={edu.institution} onChange={e => handleEducationChange(idx, 'institution', e.target.value)} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., University of Engineering" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Degree Type <span className="text-[#ef4444]">*</span></label>
                                                    <input type="text" value={edu.degree} onChange={e => handleEducationChange(idx, 'degree', e.target.value)} className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all hover:border-white/20" placeholder="e.g., Bachelor of Science in Computer Science" />
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
                                    <div className="p-4 sm:p-6 border-t border-white/5 bg-[#0A0A0F]/50">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">Comma-separated skills <span className="text-gray-600 font-medium lowercase tracking-normal">(e.g. React, Python, AWS)</span></label>
                                        <textarea 
                                            className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none font-mono transition-all hover:border-white/20 min-h-[100px] resize-y leading-relaxed shadow-inner" 
                                            value={resumeData.skills.join(', ')} 
                                            onChange={e => setResumeData({ ...resumeData, skills: e.target.value.split(',').map(s => s.trim()) })} 
                                            placeholder="React, TypeScript, Node.js, Python, AWS, Docker..."
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

                    <div className="flex-1 overflow-auto custom-scrollbar flex justify-center p-2 sm:p-6 md:p-8 relative">
                        {/* Blueprint Grid Background Pattern */}
                        <div className="absolute inset-0 pointer-events-none opacity-20" 
                            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                        </div>

                        <div
                            className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-white transform origin-top mx-auto min-w-[210mm] min-h-[297mm] h-max scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 transition-transform duration-300 ring-1 ring-white/10 relative z-10"
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