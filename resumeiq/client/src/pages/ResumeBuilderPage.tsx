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
    MetricEngineerTemplate
} from '../components/ui/resume/Templates';
import MagicRewriteButton from '../components/ui/resume/MagicRewriteButton';
import { ResumeData } from '../types/resume';
import {
    ChevronLeft,
    Plus,
    Trash2,
    FileDown,
    Layout,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

type TemplateKey = 'minimalist' | 'modern' | 'executive' | 'tech' | 'creative' | 'academic' | 'serif' | 'infographic' | 'european' | 'metric';

export default function ResumeBuilderPage() {
    // --- STATE ---
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
    const [exporting, setExporting] = useState(false);
    const printAreaRef = useRef<HTMLDivElement>(null);

    // --- FORM HANDLERS ---
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

    // --- PDF COMPILER ENGINE ---
    const handleExportPDF = async () => {
        const element = printAreaRef.current;
        if (!element) return toast.error('Render target canvas could not be compiled.');

        setExporting(true);
        const html2pdf = (await import('html2pdf.js')).default;

        const opt = {
            margin: 0,
            filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
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

    // Maps keys to their respective render outputs
    const renderSelectedTemplate = () => {
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

            {/* Top Controls Hub Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#13131A] border border-white/5 p-6 rounded-2xl mb-6">
                <div>
                    <Link to="/resumes" className="inline-flex items-center text-gray-500 hover:text-white mb-2 transition-colors text-xs font-bold group">
                        <ChevronLeft className="mr-1 group-hover:-translate-x-0.5 transition-transform" size={14} /> Back to Resumes
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Interactive Template Workspace</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Choose from 10 high-fidelity ATS engine blueprints.</p>
                </div>

                {/* Template Controls Selection Panel */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-start sm:items-center bg-[#0A0A0F] border border-white/10 p-2 rounded-xl">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 px-2">Blueprint:</span>
                        <select
                            value={activeTemplate}
                            onChange={e => setActiveTemplate(e.target.value as TemplateKey)}
                            className="bg-[#13131A] text-xs font-semibold px-4 py-1.5 rounded-lg border border-white/5 text-white outline-none cursor-pointer focus:border-blue-500"
                        >
                            <option value="minimalist">Minimalist Standard (ATS)</option>
                            <option value="modern">Modern Slate Accent</option>
                            <option value="executive">Executive Boardroom</option>
                            <option value="tech">Tech Mono Dashboard</option>
                            <option value="creative">Metro Split Creative</option>
                            <option value="academic">Academic CV Grid</option>
                            <option value="serif">Sleek Serif Editorial</option>
                            <option value="infographic">Infographic Timeline</option>
                            <option value="european">EuroPass Euro Standard</option>
                            <option value="metric">Metric High-Density</option>
                        </select>
                    </div>

                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/5 ml-auto sm:ml-0"
                    >
                        {exporting ? <Loader size={13} className="animate-spin" /> : <FileDown size={13} />}
                        {exporting ? 'Compiling PDF...' : 'Export Native PDF'}
                    </button>
                </div>
            </div>

            {/* Main Form/Preview Split Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT COLUMN: THE COMPREHENSIVE FORMS ENGINE */}
                <div className="lg:col-span-5 bg-[#13131A] border border-white/5 p-5 rounded-2xl space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">

                    {/* PERSONAL INFRASTRUCTURE CONFIGURATIONS */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-blue-400 border-b border-white/5 pb-2">
                            <User size={15} /> Personal Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                                <input
                                    type="text" name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalInfoChange}
                                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                                <input
                                    type="email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange}
                                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                                <input
                                    type="text" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange}
                                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">LinkedIn Profile</label>
                                <input
                                    type="text" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange}
                                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* PROFESSIONAL ABSTRACT */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-purple-400 border-b border-white/5 pb-2">
                            <Briefcase size={15} /> Professional Summary
                        </h3>
                        <textarea
                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
                            rows={3}
                            value={resumeData.summary}
                            onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                        />
                    </section>

                    {/* WORK EXPERIENCE FIELDS */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                                <Briefcase size={15} /> Work Experience
                            </h3>
                            <button onClick={addExperience} className="text-[10px] bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all font-bold uppercase tracking-wider">
                                <Plus size={11} /> Add Role
                            </button>
                        </div>

                        <div className="space-y-4">
                            {resumeData.experience.map((exp, idx) => (
                                <div key={idx} className="relative p-4 border border-white/5 bg-[#0A0A0F]/30 rounded-xl space-y-3">
                                    {resumeData.experience.length > 1 && (
                                        <button onClick={() => removeExperience(idx)} className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Job Title</label>
                                            <input
                                                type="text" value={exp.position} onChange={e => handleExperienceChange(idx, 'position', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Company</label>
                                            <input
                                                type="text" value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Start Date</label>
                                            <input
                                                type="text" value={exp.startDate} onChange={e => handleExperienceChange(idx, 'startDate', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">End Date</label>
                                            <input
                                                type="text" value={exp.endDate} onChange={e => handleExperienceChange(idx, 'endDate', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-end">
                                            <label className="block text-[9px] font-bold text-gray-500 uppercase">Role Achievements & Descriptions</label>
                                            <MagicRewriteButton
                                                currentText={exp.description}
                                                jobTitle={exp.position}
                                                onRewrite={newText => handleExperienceChange(idx, 'description', newText)}
                                            />
                                        </div>
                                        <textarea
                                            value={exp.description}
                                            onChange={e => handleExperienceChange(idx, 'description', e.target.value)}
                                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 min-h-[100px] font-sans resize-y text-white leading-relaxed"
                                        />
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
                                    <input
                                        type="text" value={edu.institution} onChange={e => handleEducationChange(idx, 'institution', e.target.value)}
                                        className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Degree Type</label>
                                    <input
                                        type="text" value={edu.degree} onChange={e => handleEducationChange(idx, 'degree', e.target.value)}
                                        className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 text-white"
                                    />
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* SKILLS COMPETENCIES */}
                    <section className="space-y-2">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-cyan-400 border-b border-white/5 pb-2">
                            <Wrench size={15} /> Core Skills Competencies Matrix
                        </h3>
                        <input
                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-xs outline-none text-white focus:border-blue-500 transition-all font-mono"
                            value={resumeData.skills.join(', ')}
                            onChange={e => setResumeData({ ...resumeData, skills: e.target.value.split(',').map(s => s.trim()) })}
                        />
                    </section>
                </div>

                {/* RIGHT COLUMN: HIGH-FIDELITY AUTOMATED TEMPLATE SIMULATOR SHEET */}
                <div className="lg:col-span-7 bg-[#14141A] p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-start overflow-x-auto min-h-[calc(100vh-180px)]">
                    <div className="w-full flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-widest text-gray-500 uppercase mb-3 pl-1 border-b border-white/5 pb-2">
                        <Eye size={12} /> Live Blueprint Preview Frame
                    </div>
                    <div
                        ref={printAreaRef}
                        className="shadow-[0_24px_60px_rgba(0,0,0,0.4)] bg-white rounded-sm origin-top scale-[0.75] sm:scale-[0.85] md:scale-100 transition-all duration-300 min-w-[210mm]"
                    >
                        {renderSelectedTemplate()}
                    </div>
                </div>

            </div>
        </div>
    );
}

const Loader = ({ size, className }: { size: number; className?: string }) => (
    <div className={`border-2 border-current border-t-transparent rounded-full animate-spin ${className}`} style={{ width: size, height: size }} />
);