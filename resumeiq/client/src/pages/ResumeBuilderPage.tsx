import React, { useState, useRef } from 'react';
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

    const [activeTemplate, setActiveTemplate] = useState<TemplateKey>('minimalist');
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [activeMode, setActiveMode] = useState<WorkspaceMode>('resume');
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

        try {
            const { data } = await resumeAPI.generateCoverLetter({
                resumeData,
                companyName: targetCompany,
                jobTitle: targetRole
            });
            if (data?.success && data?.data?.content) {
                setCoverLetterContent(data.data.content);
                toast.success('Tailored narrative structured successfully!', { id: loadToast });
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'AI generation pipeline was interrupted.', { id: loadToast });
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
                    data={resumeData}
                    companyName={targetCompany}
                    jobTitle={targetRole}
                    text={coverLetterContent || "Your customized AI cover letter copy variant will compile inside this canvas element block once triggered."}
                />
            );
        }

        switch (activeTemplate) {
            case 'minimalist': return <MinimalistTemplate data={resumeData} />;
            case 'modern': return <ModernTemplate data={resumeData} />;
            case 'executive': return <ExecutiveTemplate data={resumeData} />;
            case 'tech': return <TechMinimalTemplate data={resumeData} />;
            case 'creative': return <CreativeTemplate data={resumeData} />;
            case 'academic': return <AcademicTemplate data={resumeData} />;
            case 'serif': return <SleekSerifTemplate data={resumeData} />;
            case 'infographic': return <InfographicTemplate data={resumeData} />;
            case 'european': return <EuropeanTemplate data={resumeData} />;
            case 'metric': return <MetricEngineerTemplate data={resumeData} />;
            default: return <MinimalistTemplate data={resumeData} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] p-6 font-sans">

            {/* Top Controller Header Banner Panel */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#13131A] border border-white/5 p-6 rounded-2xl mb-6">
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeMode === 'resume' ? 'bg-[#5B5FEF] text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FileText size={13} /> Resume
                        </button>
                        <button
                            onClick={() => setActiveMode('coverLetter')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeMode === 'coverLetter' ? 'bg-[#5B5FEF] text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Sparkles size={13} /> Cover Letter
                        </button>
                    </div>

                    {activeMode === 'resume' && (
                        <button
                            onClick={() => setIsTemplateModalOpen(true)}
                            className="flex items-center gap-2 bg-[#13131A] hover:bg-white/5 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 text-white cursor-pointer transition-all"
                        >
                            <LayoutTemplate size={14} className="text-[#5B5FEF]" />
                            <span className="capitalize">{activeTemplate} Template</span>
                        </button>
                    )}

                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg"
                    >
                        {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown size={13} />}
                        {exporting ? 'Compiling PDF...' : 'Export PDF Document'}
                    </button>
                </div>
            </div>

            {/* Main Structural Dual Splitting Column Config */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT COLUMN COMPARTMENT FORM CANVAS */}
                <div className="lg:col-span-5 bg-[#13131A] border border-white/5 p-5 rounded-2xl space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">

                    {activeMode === 'coverLetter' ? (
                        /* --- THE ACTIVE AI COVER LETTER WRITER PANEL FORM --- */
                        <form onSubmit={handleGenerateCoverLetter} className="space-y-4">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-[#5B5FEF] border-b border-white/5 pb-2">
                                <Sparkles size={15} /> AI Cover Letter Generator Studio
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Target Enterprise Company Name</label>
                                    <input
                                        type="text" value={targetCompany} onChange={e => setTargetCompany(e.target.value)}
                                        className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="e.g., GoComet" required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Target Designation Job Title</label>
                                    <input
                                        type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)}
                                        className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="e.g., Frontend Engineer" required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={generatingLetter}
                                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#5B5FEF] hover:bg-[#4A4EDF] disabled:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-md"
                            >
                                {generatingLetter ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles size={13} />}
                                {generatingLetter ? 'Assembling AI Content Elements...' : 'Compile Tailored Cover Letter Copy'}
                            </button>

                            {coverLetterContent && (
                                <div className="mt-4 space-y-1.5">
                                    <label className="block text-[9px] font-bold text-gray-500 uppercase">Interactive Copy Review Text Sandbox</label>
                                    <textarea
                                        value={coverLetterContent} onChange={e => setCoverLetterContent(e.target.value)}
                                        className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-3 text-xs text-gray-300 min-h-[250px] font-sans resize-y leading-relaxed outline-none focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </form>
                    ) : (
                        /* --- STANDARD RESUME ENTRY CONTROLLERS FIELDS --- */
                        <>
                            {/* LINKEDIN QUICK IMPORT MODULE */}
                            <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-xl space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                                        <Linkedin size={16} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white tracking-wide">Import from LinkedIn Profile</h4>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Upload your "Save to PDF" file to fill fields instantly.</p>
                                    </div>
                                </div>
                                <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleLinkedInUpload} className="hidden" />
                                <button
                                    type="button" disabled={importingLinkedin} onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-600/5"
                                >
                                    {importingLinkedin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud size={13} />}
                                    {importingLinkedin ? 'Extracting Profiles Data...' : 'Upload Profile PDF Document'}
                                </button>
                            </div>

                            {/* PERSONAL DETAILS SECTION */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-blue-400 border-b border-white/5 pb-2">
                                    <User size={15} /> Personal Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                                        <input type="text" name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                                        <input type="email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                                        <input type="text" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">LinkedIn Profile</label>
                                        <input type="text" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all" />
                                    </div>
                                </div>
                            </section>

                            {/* PROFESSIONAL ABSTRACT SUMMARY */}
                            <section className="space-y-3">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-purple-400 border-b border-white/5 pb-2">
                                    <Briefcase size={15} /> Professional Summary
                                </h3>
                                <textarea className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500 resize-none font-sans leading-relaxed" rows={3} value={resumeData.summary} onChange={e => setResumeData({ ...resumeData, summary: e.target.value })} />
                            </section>

                            {/* WORK HISTORY CHANNELS GRID */}
                            <section className="space-y-4">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                                        <Briefcase size={15} /> Work Experience
                                    </h3>
                                    <button onClick={addExperience} className="text-[10px] bg-white/5 hover:bg-blue-600/20 px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold uppercase border border-white/10 transition-all">
                                        <Plus size={11} /> Add Role
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {resumeData.experience.map((exp, idx) => (
                                        <div key={idx} className="relative p-4 border border-white/5 bg-[#0A0A0F]/30 rounded-xl space-y-3">
                                            {resumeData.experience.length > 1 && (
                                                <button onClick={() => removeExperience(idx)} className="absolute top-3 right-3 text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
                                                <input type="text" value={exp.position} onChange={e => handleExperienceChange(idx, 'position', e.target.value)} className="bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs text-white" placeholder="Role Title" />
                                                <input type="text" value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)} className="bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs text-white" placeholder="Enterprise" />
                                                <input type="text" value={exp.startDate} onChange={e => handleExperienceChange(idx, 'startDate', e.target.value)} className="bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs text-white" placeholder="Start Date" />
                                                <input type="text" value={exp.endDate} onChange={e => handleExperienceChange(idx, 'endDate', e.target.value)} className="bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs text-white" placeholder="End Date" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-end">
                                                    <label className="block text-[9px] font-bold text-gray-500 uppercase">Role Description lines</label>
                                                    <MagicRewriteButton currentText={exp.description} jobTitle={exp.position} onRewrite={newText => handleExperienceChange(idx, 'description', newText)} />
                                                </div>
                                                <textarea value={exp.description} onChange={e => handleExperienceChange(idx, 'description', e.target.value)} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs text-white min-h-[100px]" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* ACADEMIC CREDENTIALS */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-amber-400 border-b border-white/5 pb-2">
                                    <GraduationCap size={15} /> Academic Credentials
                                </h3>
                                {resumeData.education.map((edu, idx) => (
                                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0A0A0F]/20 border border-white/5 p-4 rounded-xl">
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Institution Name</label>
                                            <input type="text" value={edu.institution} onChange={e => handleEducationChange(idx, 'institution', e.target.value)} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Degree Type</label>
                                            <input type="text" value={edu.degree} onChange={e => handleEducationChange(idx, 'degree', e.target.value)} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs text-white" />
                                        </div>
                                    </div>
                                ))}
                            </section>

                            {/* CORE COMPETENCIES MATRIX SECTION */}
                            <section className="space-y-2">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-cyan-400 border-b border-white/5 pb-2">
                                    <Wrench size={15} /> Technical Assets Matrix
                                </h3>
                                <input className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 font-mono" value={resumeData.skills.join(', ')} onChange={e => setResumeData({ ...resumeData, skills: e.target.value.split(',').map(s => s.trim()) })} />
                            </section>
                        </>
                    )}

                </div>

                {/* RIGHT COLUMN VIEWPORT PANE PANEL PREVIEW */}
                <div className="lg:col-span-7 bg-[#14141A] p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-start overflow-x-auto min-h-[calc(100vh-180px)]">
                    <div className="w-full flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-widest text-gray-500 uppercase mb-3 pl-1 border-b border-white/5 pb-2">
                        <Eye size={12} /> Live Blueprint Canvas Simulation Screen
                    </div>
                    <div
                        ref={printAreaRef}
                        className="shadow-[0_24px_60px_rgba(0,0,0,0.4)] bg-white rounded-sm origin-top scale-[0.75] sm:scale-[0.85] md:scale-100 transition-all duration-300 min-w-[210mm]"
                    >
                        {renderSelectedTemplate()}
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
                                {[
                                    { id: 'modern', name: 'Modern Template', tag: 'ATS GOLD', desc: 'Clean, structured layout that fits detailed experience on a single page.', image: '/image_614ba7.jpg' },
                                    { id: 'academic', name: 'Ivy League', tag: 'HARVARD', desc: 'Modernized Harvard format with a compact summary section and balanced white space.', image: '/image_614c06.jpg' },
                                    { id: 'serif', name: 'Elegant Layout', tag: 'COLUMN', desc: 'Side-column design that highlights skills and strengths while dedicating prime real estate.', image: '/image_614f52.jpg' },
                                    { id: 'executive', name: 'Polished Slate', tag: 'PREMIUM', desc: 'Professional design that invites recruiters to spend more time on your application.', image: '/image_614fce.jpg' },
                                    { id: 'minimalist', name: 'Single Column', tag: 'OCR RIGID', desc: 'Classic single-column with highlighted section headings. Maximum ATS compatibility.', image: '/image_61534c.jpg' },
                                    { id: 'tech', name: 'Tech Mono', tag: 'DEVELOPER', desc: 'Monospaced fonts and a terminal-like aesthetic for software engineers.', image: null },
                                    { id: 'creative', name: 'Creative Split', tag: 'DESIGN', desc: 'A bold, two-column layout with contrasting colors for creative professionals.', image: null },
                                    { id: 'infographic', name: 'Infographic', tag: 'VISUAL', desc: 'Visual representation of your skills and timeline. Great for non-traditional applications.', image: null },
                                    { id: 'european', name: 'EuroPass', tag: 'EU STANDARD', desc: 'Strict adherence to European CV standards. Perfect for overseas applications.', image: null },
                                    { id: 'metric', name: 'Metric Matrix', tag: 'DATA DRIVEN', desc: 'Focuses heavily on numbers, KPIs, and deliverables. Ideal for product and sales.', image: null },
                                ].map(t => (
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