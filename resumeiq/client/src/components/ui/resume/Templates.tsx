import React from 'react';
import { ResumeData } from '../../../types/resume';

interface TemplateProps {
    data: ResumeData;
}

// ==========================================
// 1. MINIMALIST (Strict Single-Column ATS Gold Standard)
// ==========================================
export const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="p-8 bg-white text-black font-serif text-[10.5pt] leading-relaxed max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
        <div className="text-center border-b border-gray-300 pb-3 mb-5">
            <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">{data.personalInfo.fullName}</h1>
            <div className="text-xs text-gray-600 flex flex-wrap justify-center gap-2">
                <span>{data.personalInfo.phone}</span> | <span>{data.personalInfo.email}</span> | <span>{data.personalInfo.location}</span>
                {data.personalInfo.linkedin && <> | <span>{data.personalInfo.linkedin}</span></>}
            </div>
        </div>
        {data.summary && (
            <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-1.5">Summary</h2>
                <p className="text-xs text-gray-700 font-sans leading-relaxed">{data.summary}</p>
            </div>
        )}
        <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2">Experience</h2>
            {data.experience?.map((exp, i) => (
                <div key={i} className="mb-3 break-inside-avoid">
                    <div className="flex justify-between font-sans text-xs font-bold text-gray-900">
                        <span>{exp.position} — {exp.company}</span>
                        <span className="font-normal text-gray-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-xs text-gray-700 whitespace-pre-line mt-1 pl-2 border-l border-gray-100">{exp.description}</p>
                </div>
            ))}
        </div>
        <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2">Education</h2>
            {data.education?.map((edu, i) => (
                <div key={i} className="flex justify-between text-xs mb-1.5 break-inside-avoid">
                    <div>
                        <span className="font-bold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</span>
                        <div className="text-gray-600">{edu.institution}</div>
                    </div>
                    <span className="text-gray-500">{edu.startDate} – {edu.endDate}</span>
                </div>
            ))}
        </div>
        <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-1.5">Skills</h2>
            <p className="text-xs text-gray-700 font-sans tracking-wide">{data.skills?.join(', ')}</p>
        </div>
    </div>
);

// ==========================================
// 2. MODERN ACCENT (Sleek Dark Header slate)
// ==========================================
export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="p-10 bg-white text-slate-800 font-sans text-[10pt] leading-normal max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
        <div className="mb-6 bg-slate-900 text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black tracking-tight">{data.personalInfo.fullName}</h1>
                <p className="text-blue-400 text-xs font-medium uppercase tracking-widest mt-1">Specialized Engineering Professional</p>
            </div>
            <div className="text-xs text-slate-400 space-y-0.5 text-left md:text-right font-mono">
                <div>{data.personalInfo.phone}</div>
                <div>{data.personalInfo.email}</div>
                <div>{data.personalInfo.location}</div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
                <section>
                    <h2 className="text-xs font-extrabold text-slate-900 border-b-2 border-slate-100 pb-1 mb-3 uppercase tracking-wide">Work History</h2>
                    {data.experience?.map((exp, i) => (
                        <div key={i} className="mb-3 break-inside-avoid">
                            <h4 className="font-bold text-slate-900 text-xs">{exp.position}</h4>
                            <div className="text-[11px] text-blue-600 font-semibold mb-1">{exp.company} <span className="text-gray-400 font-normal">| {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span></div>
                            <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                        </div>
                    ))}
                </section>
            </div>
            <div className="space-y-5">
                <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">Expertise</h2>
                    <div className="flex flex-wrap gap-1">
                        {data.skills?.map((s, i) => (
                            <span key={i} className="bg-white border border-slate-200 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md">{s}</span>
                        ))}
                    </div>
                </section>
                <section className="pl-1">
                    <h2 className="text-xs font-extrabold text-slate-900 border-b-2 border-slate-100 pb-1 mb-2.5 uppercase tracking-wide">Education</h2>
                    {data.education?.map((edu, i) => (
                        <div key={i} className="mb-2 break-inside-avoid">
                            <div className="font-bold text-slate-900 text-xs">{edu.degree}</div>
                            <div className="text-slate-600 text-[11px]">{edu.fieldOfStudy}</div>
                            <div className="text-gray-400 text-[10px] mt-0.5">{edu.institution}</div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    </div>
);

// ==========================================
// 3. EXECUTIVE (High-End Leadership Classic)
// ==========================================
export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="p-10 bg-white text-stone-800 font-serif text-[10.5pt] leading-relaxed max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
        <div className="text-center border-b-2 border-stone-800 pb-4 mb-6">
            <h1 className="text-3xl font-normal text-stone-900 tracking-wide uppercase mb-1.5">{data.personalInfo.fullName}</h1>
            <div className="text-xs text-stone-500 font-sans tracking-wider space-x-3">
                <span>{data.personalInfo.location}</span>•<span>{data.personalInfo.phone}</span>•<span>{data.personalInfo.email}</span>
            </div>
        </div>
        <div className="space-y-5">
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 break-inside-avoid">
                <div className="text-xs font-bold uppercase tracking-widest text-stone-500 font-sans">Profile</div>
                <div className="md:col-span-3 text-xs text-stone-700 leading-relaxed font-sans">{data.summary}</div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-xs font-bold uppercase tracking-widest text-stone-500 font-sans">Experience</div>
                <div className="md:col-span-3 space-y-4">
                    {data.experience?.map((exp, i) => (
                        <div key={i} className="break-inside-avoid">
                            <div className="flex justify-between font-bold text-xs text-stone-900">
                                <span>{exp.position.toUpperCase()}</span>
                                <span className="font-normal text-stone-500 font-sans text-[11px]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <div className="text-[11px] font-sans italic text-stone-600 mt-0.5">{exp.company}</div>
                            <p className="text-xs text-stone-700 whitespace-pre-line mt-1.5 leading-relaxed">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-xs font-bold uppercase tracking-widest text-stone-500 font-sans">Skills</div>
                <div className="md:col-span-3 text-xs font-sans text-stone-700 tracking-wide leading-relaxed">{data.skills?.join('  •  ')}</div>
            </section>
        </div>
    </div>
);

// ==========================================
// 4. TECH MINIMAL (Sleek Clean Left-Border Grid)
// ==========================================
export const TechMinimalTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="p-8 bg-white text-zinc-800 font-sans text-[10pt] max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
        <div className="border-l-4 border-cyan-500 pl-4 mb-6">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">{data.personalInfo.fullName}</h1>
            <p className="text-xs font-mono text-zinc-500 mt-1">{data.personalInfo.email}  |  {data.personalInfo.phone}  |  {data.personalInfo.location}</p>
        </div>
        <div className="space-y-5">
            <section className="break-inside-avoid">
                <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-600 mb-1.5">01 // Expertise Summary</h3>
                <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-100">{data.summary}</p>
            </section>
            <section>
                <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-600 mb-3">02 // Professional Milestones</h3>
                <div className="space-y-4">
                    {data.experience?.map((exp, i) => (
                        <div key={i} className="break-inside-avoid pl-3 border-l border-zinc-200">
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-bold text-zinc-900 text-xs">{exp.position} <span className="font-normal text-zinc-400">at {exp.company}</span></h4>
                                <span className="text-[10px] font-mono text-zinc-400">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <p className="text-xs text-zinc-600 whitespace-pre-line mt-1 leading-relaxed font-mono text-[11px]">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="break-inside-avoid">
                <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-600 mb-2">03 // Technical Toolkit</h3>
                <div className="flex flex-wrap gap-1">
                    {data.skills?.map((s, i) => (
                        <span key={i} className="bg-zinc-100 text-zinc-800 text-[10px] font-mono px-2.5 py-0.5 rounded">{s}</span>
                    ))}
                </div>
            </section>
        </div>
    </div>
);

// ==========================================
// 5. METRO CREATIVE (Dynamic Left Column Sidebar Layout)
// ==========================================
export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="bg-white text-neutral-800 font-sans text-[10pt] max-w-[210mm] min-h-[297mm] mx-auto box-border flex pdf-page p-0">
        <div className="w-[65mm] bg-neutral-900 text-neutral-300 p-6 flex flex-col justify-between">
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white tracking-tight uppercase">{data.personalInfo.fullName}</h1>
                    <div className="w-8 h-1 bg-amber-400 mt-2"></div>
                </div>
                <div className="space-y-2 text-[11px] font-light text-neutral-400 break-all">
                    <div><p className="font-bold text-white text-[10px] uppercase font-mono">Contact</p>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.location}</div>
                </div>
                <div>
                    <p className="font-bold text-white text-[10px] uppercase font-mono mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                        {data.skills?.map((s, i) => (
                            <span key={i} className="bg-white/10 text-white text-[9px] px-2 py-0.5 rounded">{s}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="flex-1 p-8 space-y-5 bg-neutral-50/50">
            <section className="break-inside-avoid">
                <h2 className="text-xs font-black uppercase text-neutral-900 tracking-wider mb-2">About Me</h2>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">{data.summary}</p>
            </section>
            <section>
                <h2 className="text-xs font-black uppercase text-neutral-900 tracking-wider mb-3">Experience</h2>
                <div className="space-y-4">
                    {data.experience?.map((exp, i) => (
                        <div key={i} className="break-inside-avoid">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-neutral-900 text-xs">{exp.position}</h3>
                                <span className="text-[10px] text-neutral-400">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <p className="text-[11px] text-amber-600 font-medium mb-1">{exp.company}</p>
                            <p className="text-xs text-neutral-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    </div>
);

// ==========================================
// 6. ACADEMIC (Traditional CV Layout)
// ==========================================
export const AcademicTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="p-10 bg-white text-black font-serif text-[11pt] max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
        <div className="text-center mb-6">
            <h1 className="text-2xl font-normal tracking-wide uppercase mb-1">{data.personalInfo.fullName}</h1>
            <p className="text-xs italic text-gray-600">{data.personalInfo.location}  •  {data.personalInfo.phone}  •  {data.personalInfo.email}</p>
        </div>
        <div className="space-y-5">
            <section>
                <h2 className="text-sm font-bold uppercase border-b border-black pb-0.5 mb-2.5 tracking-wide">Education</h2>
                {data.education?.map((edu, i) => (
                    <div key={i} className="flex justify-between text-xs mb-2 break-inside-avoid">
                        <div>
                            <span className="font-bold">{edu.institution}</span>
                            <div className="italic">{edu.degree} in {edu.fieldOfStudy}</div>
                        </div>
                        <span className="text-gray-500 font-sans text-[11px]">{edu.startDate} – {edu.endDate}</span>
                    </div>
                ))}
            </section>
            <section>
                <h2 className="text-sm font-bold uppercase border-b border-black pb-0.5 mb-2.5 tracking-wide">Professional Appointments</h2>
                {data.experience?.map((exp, i) => (
                    <div key={i} className="mb-3 break-inside-avoid">
                        <div className="flex justify-between font-bold text-xs">
                            <span>{exp.position}, {exp.company}</span>
                            <span className="font-normal text-gray-500 font-sans text-[11px]">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <p className="text-xs text-gray-700 whitespace-pre-line mt-1 leading-relaxed pl-3">{exp.description}</p>
                    </div>
                ))}
            </section>
        </div>
    </div>
);

// ==========================================
// 7. SLEEK SERIF (Elegant Editorial Editorial Format)
// ==========================================
export const SleekSerifTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="p-10 bg-stone-50 text-stone-900 font-serif text-[10.5pt] leading-relaxed max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
        <div className="flex justify-between items-baseline border-b border-stone-300 pb-4 mb-6">
            <h1 className="text-3xl font-light tracking-wide text-stone-900">{data.personalInfo.fullName}</h1>
            <div className="text-[11px] font-sans text-stone-500 text-right space-y-0.5">
                <div>{data.personalInfo.phone}</div>
                <div>{data.personalInfo.email}</div>
            </div>
        </div>
        <div className="space-y-6">
            {data.summary && <p className="text-xs italic text-stone-600 font-sans border-l-2 border-stone-300 pl-4 leading-relaxed">{data.summary}</p>}
            <section>
                <h2 className="text-xs font-sans uppercase tracking-widest text-stone-400 font-bold mb-3">Employment History</h2>
                {data.experience?.map((exp, i) => (
                    <div key={i} className="mb-4 break-inside-avoid">
                        <div className="flex justify-between items-baseline font-bold text-xs text-stone-900">
                            <span>{exp.position} — {exp.company}</span>
                            <span className="font-normal text-stone-400 font-sans text-[11px]">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <p className="text-xs text-stone-700 whitespace-pre-line mt-1.5 leading-relaxed">{exp.description}</p>
                    </div>
                ))}
            </section>
        </div>
    </div>
);

// ==========================================
// 8. INFOGRAPHIC TECH (Dual Accent Top Grid Bar)
// ==========================================
export const InfographicTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="p-8 bg-white text-slate-800 font-sans text-[10pt] max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
        <div className="grid grid-cols-3 gap-4 border-b-4 border-indigo-600 pb-4 mb-5">
            <div className="col-span-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{data.personalInfo.fullName.toUpperCase()}</h1>
                <p className="text-xs text-slate-500 font-mono mt-1">{data.personalInfo.location}</p>
            </div>
            <div className="text-[11px] text-right text-indigo-600 font-bold font-mono space-y-0.5">
                <div>{data.personalInfo.phone}</div>
                <div>{data.personalInfo.email}</div>
            </div>
        </div>
        <div className="space-y-4">
            <div className="bg-indigo-50/50 border border-indigo-100/60 p-3 rounded-xl text-xs text-indigo-950 leading-relaxed font-medium break-inside-avoid">{data.summary}</div>
            <section>
                <h2 className="text-xs font-extrabold text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-1.5">⚡ Professional Timeline</h2>
                {data.experience?.map((exp, i) => (
                    <div key={i} className="mb-3.5 break-inside-avoid pl-3 border-l-2 border-indigo-100">
                        <div className="flex justify-between text-xs font-bold text-slate-900">
                            <span>{exp.position} <span className="text-indigo-600">@ {exp.company}</span></span>
                            <span className="font-normal text-slate-400 font-mono text-[10px]">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <p className="text-xs text-slate-600 whitespace-pre-line mt-1 leading-relaxed">{exp.description}</p>
                    </div>
                ))}
            </section>
            <section className="break-inside-avoid">
                <h2 className="text-xs font-extrabold text-indigo-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">🛠️ Core Capabilities</h2>
                <div className="flex flex-wrap gap-1">
                    {data.skills?.map((s, i) => (
                        <span key={i} className="bg-slate-100 text-slate-800 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200">{s}</span>
                    ))}
                </div>
            </section>
        </div>
    </div>
);

// ==========================================
// 9. EUROPEAN PASS (Structured Box Border Standard)
// ==========================================
export const EuropeanTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="p-8 bg-white text-zinc-800 font-sans text-[10pt] max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
        <div className="grid grid-cols-4 border-b border-zinc-200 pb-4 mb-5 items-center">
            <div className="col-span-1 text-xs font-bold text-blue-700 tracking-wider uppercase font-mono">Curriculum Vitae</div>
            <div className="col-span-3 text-right">
                <h1 className="text-xl font-extrabold text-zinc-900">{data.personalInfo.fullName}</h1>
                <p className="text-[11px] text-zinc-400 font-mono">{data.personalInfo.email}  |  {data.personalInfo.phone}</p>
            </div>
        </div>
        <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 break-inside-avoid">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Summary</div>
                <div className="col-span-3 text-xs text-zinc-600 leading-relaxed">{data.summary}</div>
            </div>
            <div className="border-t border-zinc-100 pt-3">
                {data.experience?.map((exp, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 mb-4 break-inside-avoid">
                        <div className="text-[10px] font-mono text-zinc-400">{exp.startDate} – {exp.endDate}</div>
                        <div className="col-span-3">
                            <h4 className="font-bold text-zinc-900 text-xs">{exp.position}</h4>
                            <p className="text-[11px] text-blue-600 font-medium">{exp.company}</p>
                            <p className="text-xs text-zinc-500 whitespace-pre-line mt-1.5 leading-relaxed">{exp.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ==========================================
// 10. METRIC ENGINEER (Compact High-Density Text Matrix)
// ==========================================
export const MetricEngineerTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="p-8 bg-white text-slate-900 font-sans text-[9.5pt] leading-tight max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2 mb-4">
            <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase">{data.personalInfo.fullName}</h1>
                <p className="text-xs font-mono text-slate-500">{data.personalInfo.location}</p>
            </div>
            <div className="text-[11px] font-mono text-right text-slate-600 space-y-0.5">
                <div>{data.personalInfo.phone} | {data.personalInfo.email}</div>
                {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
            </div>
        </div>
        <div className="space-y-4">
            <section>
                <h2 className="text-xs font-bold uppercase bg-slate-100 px-2 py-0.5 mb-2 tracking-wide border-l-2 border-slate-900">Experience Matrix</h2>
                {data.experience?.map((exp, i) => (
                    <div key={i} className="mb-3 break-inside-avoid">
                        <div className="flex justify-between font-bold text-xs">
                            <span>{exp.position} — <span className="font-medium text-slate-600">{exp.company}</span></span>
                            <span className="font-mono text-[10px] text-slate-400">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <p className="text-xs text-slate-700 whitespace-pre-line mt-1 font-sans pl-3 border-l border-slate-200 leading-normal">{exp.description}</p>
                    </div>
                ))}
            </section>
            <section className="break-inside-avoid">
                <h2 className="text-xs font-bold uppercase bg-slate-100 px-2 py-0.5 mb-1.5 tracking-wide border-l-2 border-slate-900">Technical Assets</h2>
                <p className="text-xs text-slate-800 font-mono tracking-wide px-1">{data.skills?.join('  |  ')}</p>
            </section>
        </div>
    </div>
);

// ==========================================
// --- NEW: MATCHING COVER LETTER Blueprints COMPONENT ---
// ==========================================
interface CoverLetterProps {
    data: ResumeData;
    companyName: string;
    jobTitle: string;
    text: string;
}

export const MatchingCoverLetterTemplate: React.FC<CoverLetterProps> = ({ data, companyName, jobTitle, text }) => {
    // Formats paragraphs separated by linebreaks safely into clean UI blocks
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);

    return (
        <div className="p-10 bg-white text-slate-800 font-sans text-[11pt] leading-relaxed max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
            {/* Header Info Module */}
            <div className="border-b-2 border-slate-900 pb-4 mb-8">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">{data.personalInfo.fullName}</h1>
                <p className="text-xs font-mono text-slate-500 mt-1">{data.personalInfo.email}  |  {data.personalInfo.phone}  |  {data.personalInfo.location}</p>
            </div>

            {/* Recipient Metadata Block */}
            <div className="text-xs font-sans text-slate-500 space-y-0.5 mb-8">
                <div className="font-bold text-slate-900">Hiring Selection Committee</div>
                <div>{companyName} Enterprise Hub</div>
                <div className="italic mt-2">Re: Application for the position of {jobTitle}</div>
            </div>

            {/* Structured Content Loop */}
            <div className="space-y-5 text-slate-700 text-justify font-sans text-[10.5pt]">
                {paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                ))}
            </div>

            {/* Formal Sign-off Component Layout */}
            <div className="mt-12 space-y-1">
                <div className="text-xs font-mono text-gray-400">Respectfully compiled,</div>
                <div className="font-bold text-slate-900 text-sm mt-4">{data.personalInfo.fullName}</div>
            </div>
        </div>
    );
};