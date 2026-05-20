import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MinimalistTemplate, ModernTemplate } from '../components/ui/resume/Templates';
import MagicRewriteButton from '../components/ui/resume/MagicRewriteButton';
import { ResumeData } from '../types/resume';
import {
    ChevronLeft,
    Plus,
    Trash2,
    FileDown,
    Layout,
    Layers,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

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

    const [activeTemplate, setActiveTemplate] = useState<'minimalist' | 'modern'>('minimalist');
    const [exporting, setExporting] = useState(false);
    const printAreaRef = useRef<HTMLDivElement>(null);

    // --- GENERAL FORM HANDLERS ---
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

    // --- PDF EXPORT SUITE ---
    const handleExportPDF = async () => {
        const element = printAreaRef.current;
        if (!element) return toast.error('Render target canvas could not be compiled.');

        setExporting(true);
        const html2pdf = (await import('html2pdf.js')).default;

        const opt = {
            margin: 0,
            filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] p-6 font-sans">

            {/* Top Controller Panel Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#13131A] border border-white/5 p-6 rounded-2xl mb-6">
                <div>
                    <Link to="/resumes" className="inline-flex items-center text-gray-500 hover:text-white mb-2 transition-colors text-xs font-bold group">
                        <ChevronLeft className="mr-1 group-hover:-translate-x-0.5 transition-transform" size={14} /> Back to Resumes
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Interactive Template Workspace</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Toggle semantic ATS structures and export layouts natively.</p>
                </div>

                {/* Template Switching Control Elements */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex bg-[#0A0A0F] border border-white/10 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTemplate('minimalist')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTemplate === 'minimalist' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Layout size={13} /> Minimalist (ATS)
                        </button>
                        <button
                            onClick={() => setActiveTemplate('modern')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTemplate === 'modern' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Layers size={13} /> Modern Accent
                        </button>
                    </div>

                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/5"
                    >
                        {exporting ? <Loader size={13} className="animate-spin" /> : <FileDown size={13} />}
                        {exporting ? 'Compiling PDF...' : 'Export Native PDF'}
                    </button>
                </div>
            </div>

            {/* Main Split Window Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT COLUMN: SCROLLABLE DATA ENTRY SHIELD FORM */}
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
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                                <input
                                    type="email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange}
                                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all"
                                    placeholder="john@ncode.io"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                                <input
                                    type="text" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange}
                                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all"
                                    placeholder="+91 98765..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">LinkedIn Profile Link</label>
                                <input
                                    type="text" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange}
                                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-all"
                                    placeholder="linkedin.com/in/username"
                                />
                            </div>
                        </div>
                    </section>

                    {/* BACKGROUND PROFESSIONAL PROFILE ABSTRACT */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-purple-400 border-b border-white/5 pb-2">
                            <Briefcase size={15} /> Professional Summary
                        </h3>
                        <textarea
                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
                            rows={3}
                            value={resumeData.summary}
                            onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                            placeholder="Summarize structural skill assets map profiles..."
                        />
                    </section>

                    {/* HISTORICAL WORK EXPERIENCE ARRAYS LIST */}
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
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none text-white"
                                                placeholder="Software Engineer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Company</label>
                                            <input
                                                type="text" value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none text-white"
                                                placeholder="Google"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Start Date</label>
                                            <input
                                                type="text" value={exp.startDate} onChange={e => handleExperienceChange(idx, 'startDate', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none text-white"
                                                placeholder="Nov 2025"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">End Date</label>
                                            <input
                                                type="text" value={exp.endDate} onChange={e => handleExperienceChange(idx, 'endDate', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none text-white"
                                                placeholder="Present"
                                            />
                                        </div>
                                    </div>

                                    {/* BULLET DESCRIPTIONS AND AI INTEGRATION ROW */}
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
                                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none min-h-[100px] font-sans resize-y text-white leading-relaxed"
                                            placeholder="Map out professional outcomes and execution milestones here..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* EDUCATION SCHEMATIC INFRASTRUCTURE BLOCK */}
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

                    {/* MATRICES SKILLS ARRAY CONTROLS TAGS */}
                    <section className="space-y-2">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-cyan-400 border-b border-white/5 pb-2">
                            <Wrench size={15} /> Core Skills Competencies Matrix
                        </h3>
                        <input
                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-xs outline-none text-white focus:border-blue-500 transition-all font-mono"
                            value={resumeData.skills.join(', ')}
                            onChange={e => setResumeData({ ...resumeData, skills: e.target.value.split(',').map(s => s.trim()) })}
                            placeholder="React, Python, TypeScript..."
                        />
                    </section>
                </div>

                {/* RIGHT COLUMN: HIGH-FIDELITY LIVE CANVAS SIMULATOR SHEET */}
                <div className="lg:col-span-7 bg-[#14141A] p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-start overflow-x-auto min-h-[calc(100vh-180px)]">
                    <div className="w-full flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-widest text-gray-500 uppercase mb-3 pl-1 border-b border-white/5 pb-2">
                        <Eye size={12} /> Real-Time Template Compiler Simulation Screen
                    </div>
                    <div
                        ref={printAreaRef}
                        className="shadow-[0_24px_60px_rgba(0,0,0,0.4)] bg-white rounded-sm origin-top scale-[0.75] sm:scale-[0.85] md:scale-100 transition-all duration-300 min-w-[210mm]"
                    >
                        {activeTemplate === 'minimalist' ? (
                            <MinimalistTemplate data={resumeData} />
                        ) : (
                            <ModernTemplate data={resumeData} />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Compact structural vector asset loader mapping indicator
const Loader = ({ size, className }: { size: number; className?: string }) => (
    <div className={`border-2 border-current border-t-transparent rounded-full animate-spin ${className}`} style={{ width: size, height: size }} />
);