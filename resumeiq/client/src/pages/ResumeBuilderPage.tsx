import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Download } from 'lucide-react';
import MagicRewriteButton from '../components/ui/resume/MagicRewriteButton';

// --- TYPES ---
interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface ResumeData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        linkedin: string;
    };
    experience: Experience[];
}

export default function ResumeBuilderPage() {
    // --- STATE ---
    const [resumeData, setResumeData] = useState<ResumeData>({
        personalInfo: { fullName: '', email: '', phone: '', linkedin: '' },
        experience: [
            { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '' }
        ]
    });

    // --- HANDLERS ---
    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [name]: value }
        }));
    };

    const handleExperienceChange = (id: string, field: keyof Experience, value: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '' }
            ]
        }));
    };

    const removeExperience = (id: string) => {
        if (resumeData.experience.length === 1) return;
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] p-6 font-sans flex flex-col md:flex-row gap-6">

            {/* LEFT COLUMN: THE FORM */}
            <div className="w-full md:w-1/2 flex flex-col h-[calc(100vh-48px)]">
                <Link to="/resumes" className="inline-flex items-center text-gray-500 hover:text-white mb-6 transition-colors text-sm font-bold w-max">
                    <ChevronLeft className="mr-1" size={18} />
                    Back to Resumes
                </Link>

                <h1 className="text-2xl font-black mb-6">Resume Builder</h1>

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto pr-4 space-y-8 custom-scrollbar">

                    {/* PERSONAL INFO SECTION */}
                    <section className="bg-[#13131A] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-lg font-bold mb-4 text-[#5B5FEF]">Personal Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                                <input
                                    type="text" name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalInfoChange}
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3 text-sm focus:border-[#5B5FEF] focus:outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                                <input
                                    type="email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange}
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3 text-sm focus:border-[#5B5FEF] focus:outline-none"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
                                <input
                                    type="text" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange}
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3 text-sm focus:border-[#5B5FEF] focus:outline-none"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">LinkedIn</label>
                                <input
                                    type="text" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange}
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3 text-sm focus:border-[#5B5FEF] focus:outline-none"
                                    placeholder="linkedin.com/in/johndoe"
                                />
                            </div>
                        </div>
                    </section>

                    {/* WORK EXPERIENCE SECTION */}
                    <section className="bg-[#13131A] p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[#5B5FEF]">Work Experience</h2>
                            <button onClick={addExperience} className="text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                <Plus size={14} /> Add
                            </button>
                        </div>

                        <div className="space-y-6">
                            {resumeData.experience.map((exp, index) => (
                                <div key={exp.id} className="relative p-5 border border-white/5 bg-white/[0.01] rounded-xl">
                                    {resumeData.experience.length > 1 && (
                                        <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Job Title</label>
                                            <input
                                                type="text" value={exp.position} onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-sm focus:border-[#5B5FEF] focus:outline-none"
                                                placeholder="Software Engineer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Company</label>
                                            <input
                                                type="text" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-sm focus:border-[#5B5FEF] focus:outline-none"
                                                placeholder="Google"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
                                            <input
                                                type="text" value={exp.startDate} onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-sm focus:border-[#5B5FEF] focus:outline-none"
                                                placeholder="Jan 2020"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
                                            <input
                                                type="text" value={exp.endDate} onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-sm focus:border-[#5B5FEF] focus:outline-none"
                                                placeholder="Present"
                                            />
                                        </div>
                                    </div>

                                    {/* THIS IS WHERE THE MAGIC REWRITE LIVES */}
                                    <div className="mt-4 border-t border-white/5 pt-4">
                                        <div className="flex justify-between items-end mb-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Job Description</label>
                                            <MagicRewriteButton
                                                currentText={exp.description}
                                                jobTitle={exp.position}
                                                onRewrite={(newText) => handleExperienceChange(exp.id, 'description', newText)}
                                            />
                                        </div>
                                        <textarea
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-3 text-sm focus:border-[#5B5FEF] focus:outline-none min-h-[120px] resize-y"
                                            placeholder="Describe your responsibilities and achievements..."
                                        />
                                    </div>

                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* RIGHT COLUMN: LIVE PDF PREVIEW */}
            <div className="w-full md:w-1/2 bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
                {/* Preview Header */}
                <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center text-black">
                    <span className="font-bold text-sm">Live Preview</span>
                    <button className="flex items-center gap-2 bg-[#5B5FEF] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#4A4EDF] transition-colors">
                        <Download size={16} /> Export PDF
                    </button>
                </div>

                {/* The Actual "Paper" Preview */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <div className="bg-white w-full min-h-[800px] shadow-sm border border-gray-200 p-8 text-black">

                        {/* Header Preview */}
                        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                            <h1 className="text-3xl font-serif font-bold uppercase tracking-widest">{resumeData.personalInfo.fullName || 'YOUR NAME'}</h1>
                            <div className="text-xs text-gray-600 mt-2 flex justify-center gap-4 flex-wrap">
                                <span>{resumeData.personalInfo.email || 'email@example.com'}</span>
                                <span>•</span>
                                <span>{resumeData.personalInfo.phone || '(555) 555-5555'}</span>
                                <span>•</span>
                                <span>{resumeData.personalInfo.linkedin || 'linkedin.com/in/username'}</span>
                            </div>
                        </div>

                        {/* Experience Preview */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-800 border-b border-gray-300 pb-1">Professional Experience</h2>

                            <div className="space-y-4">
                                {resumeData.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline font-bold text-sm">
                                            <h3 className="text-gray-900">{exp.company || 'Company Name'}</h3>
                                            <span className="text-gray-600 text-xs italic">{exp.startDate || 'Start Date'} – {exp.endDate || 'End Date'}</span>
                                        </div>
                                        <div className="text-sm font-semibold italic text-gray-700 mb-1">
                                            {exp.position || 'Job Title'}
                                        </div>
                                        <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                                            {exp.description || '• Describe your achievements here...'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}