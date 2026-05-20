import React from 'react';
import { ResumeData } from '../../../types/resume';

interface TemplateProps {
    data: ResumeData;
}

// --- 1. MINIMALIST TEMPLATE (Strict Single-Column ATS Gold Standard) ---
export const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="p-8 bg-white text-black font-serif text-[11pt] leading-relaxed max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
            <div className="text-center border-b border-gray-300 pb-4 mb-6">
                <h1 className="text-2xl font-bold tracking-tight uppercase mb-1">{data.personalInfo.fullName}</h1>
                <div className="text-xs text-gray-600 flex flex-wrap justify-center gap-2">
                    <span>{data.personalInfo.phone}</span> | <span>{data.personalInfo.email}</span> | <span>{data.personalInfo.location}</span>
                    {data.personalInfo.linkedin && <> | <span>{data.personalInfo.linkedin}</span></>}
                    {data.personalInfo.website && <> | <span>{data.personalInfo.website}</span></>}
                </div>
            </div>

            {data.summary && (
                <div className="mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2">Professional Summary</h2>
                    <p className="text-sm text-gray-700 font-sans">{data.summary}</p>
                </div>
            )}

            <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2">Experience</h2>
                {data.experience.map((exp, i) => (
                    <div key={i} className="mb-4 break-inside-avoid">
                        <div className="flex justify-between font-sans text-sm font-bold text-gray-900">
                            <span>{exp.position} — {exp.company}</span>
                            <span className="font-normal text-gray-500 text-xs">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <p className="text-xs text-gray-700 whitespace-pre-line mt-1 font-serif pl-2 border-l border-gray-100">{exp.description}</p>
                    </div>
                ))}
            </div>

            <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2">Education</h2>
                {data.education.map((edu, i) => (
                    <div key={i} className="flex justify-between text-sm mb-2 break-inside-avoid">
                        <div>
                            <span className="font-bold text-gray-900">{data.education[0]?.degree} in {edu.fieldOfStudy}</span>
                            <div className="text-xs text-gray-600">{edu.institution}</div>
                        </div>
                        <span className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</span>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2">Skills</h2>
                <p className="text-sm text-gray-700 font-sans tracking-wide">{data.skills.join(', ')}</p>
            </div>
        </div>
    );
};

// --- 2. MODERN TEMPLATE (Left Dynamic Accents Header) ---
export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="p-10 bg-white text-slate-800 font-sans text-[10.5pt] leading-normal max-w-[210mm] min-h-[297mm] mx-auto box-border pdf-page">
            <div className="mb-6 bg-slate-900 text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">{data.personalInfo.fullName}</h1>
                    <p className="text-blue-400 text-xs font-medium uppercase tracking-widest mt-1">Specialized Engineering professional</p>
                </div>
                <div className="text-xs text-slate-400 space-y-1 text-left md:text-right font-mono">
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.location}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <section>
                        <h2 className="text-sm font-extrabold text-slate-900 border-b-2 border-slate-100 pb-1 mb-3 uppercase tracking-wide">Work History</h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="mb-4 break-inside-avoid">
                                <h4 className="font-bold text-slate-900 text-sm">{exp.position}</h4>
                                <div className="text-xs text-blue-600 font-semibold mb-1">{exp.company} <span className="text-gray-400 font-normal">| {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span></div>
                                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                            </div>
                        ))}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Core Expertise</h2>
                        <div className="flex flex-wrap gap-1.5">
                            {data.skills.map((s, i) => (
                                <span key={i} className="bg-white border border-slate-200 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="pl-2">
                        <h2 className="text-sm font-extrabold text-slate-900 border-b-2 border-slate-100 pb-1 mb-3 uppercase tracking-wide">Education</h2>
                        {data.education.map((edu, i) => (
                            <div key={i} className="mb-3 break-inside-avoid">
                                <div className="font-bold text-slate-900 text-xs">{edu.degree}</div>
                                <div className="text-slate-600 text-[11px]">{edu.fieldOfStudy}</div>
                                <div className="text-gray-400 text-[10px] mt-0.5">{edu.institution} ({edu.endDate})</div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};