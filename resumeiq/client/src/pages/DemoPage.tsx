import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles, ScanSearch, LayoutTemplate, FileText,
    Linkedin, BrainCircuit, ArrowLeft, BarChart3, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import Footer from '../components/ui/Footer';

export default function DemoPage() {
    const navigate = useNavigate();
    const [atsScore, setAtsScore] = useState(68);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [bulletText, setBulletText] = useState("Responsible for frontend dashboard components.");

    const runDemoOptimization = () => {
        if (isOptimizing) return;
        setIsOptimizing(true);
        const loading = toast.loading("Executing Llama-3.1 syntax mutations...");

        setTimeout(() => {
            setBulletText("Architected highly-performant React dashboard architecture, reducing latency by 400ms and driving a 31% lift in MAU.");
            setAtsScore(92);
            toast.success("Vector alignment optimization complete!", { id: loading });
            setIsOptimizing(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] font-sans p-6 overflow-x-hidden">
            {/* Top Header Controls Banner */}
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#13131A] border border-white/5 p-6 rounded-2xl mb-8">
                <div>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-white transition-colors mb-2 gap-1"
                    >
                        <ArrowLeft size={14} /> Back to Terminal Front
                    </button>
                    <h1 className="text-xl font-black tracking-tight">Interactive Sandbox Simulation</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Test-driving hyper-targeted candidate matching profiles in real time.</p>
                </div>
                <button
                    onClick={() => navigate('/register')}
                    className="bg-[#5B5FEF] hover:bg-[#4A4EDF] text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#5B5FEF]/15"
                >
                    Deploy Your Own Instance
                </button>
            </div>

            {/* Sandbox Matrix Workspace Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column Controls */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Telemetry Panel */}
                    <div className="bg-[#13131A] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                            <BrainCircuit size={16} className="text-[#5B5FEF]" /> Engine Telemetry
                        </h3>
                        <div className="text-5xl font-black mb-3 transition-all duration-500" style={{ color: atsScore > 80 ? '#3DEBA6' : '#5B5FEF' }}>
                            {atsScore}%
                        </div>
                        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${atsScore}%`, backgroundColor: atsScore > 80 ? '#3DEBA6' : '#5B5FEF' }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                            Current vector space state shows {atsScore < 80 ? "critical keyword gaps in core optimization matrices." : "high-density lexical alignment ready for deployment."}
                        </p>
                    </div>

                    {/* Operational Trigger Sandbox Button */}
                    <div className="bg-[#13131A] border border-white/5 rounded-2xl p-5 space-y-3">
                        <div className="text-xs font-bold text-gray-400">Pipeline Actions</div>
                        <button
                            onClick={runDemoOptimization}
                            disabled={isOptimizing}
                            className="w-full flex items-center justify-center gap-2 bg-[#5B5FEF] hover:bg-[#4A4EDF] disabled:bg-zinc-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-md"
                        >
                            <Sparkles size={13} className={isOptimizing ? "animate-spin" : ""} />
                            {isOptimizing ? "Refactoring..." : "Execute Magic Bullet Rewrite"}
                        </button>
                    </div>
                </div>

                {/* Right Column Interactive Artifact Fields */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-[#13131A] border border-white/5 rounded-2xl p-6 space-y-6">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <FileText size={16} className="text-[#5B5FEF]" />
                            <h2 className="text-sm font-bold">Live Schema Ingestion Mirror</h2>
                        </div>

                        {/* Interactive Data Block */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Target Designation</label>
                                <div className="w-full bg-[#0A0A0F] border border-white/5 rounded-lg p-3 text-xs text-gray-300 font-mono">
                                    Frontend and Python Developer
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Work History Block Modification Layer</label>
                                <div className="bg-[#0A0A0F] border border-white/5 rounded-xl p-4 space-y-2">
                                    <div className="text-xs font-bold text-white">Saiket Systems <span className="text-gray-500 font-normal">— Frontend Intern</span></div>
                                    <p className="text-xs text-gray-400 leading-relaxed font-mono p-3 bg-white/[0.02] border border-white/5 rounded-lg transition-all duration-300">
                                        {bulletText}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Academic Ingestion Array</label>
                                <div className="w-full bg-[#0A0A0F] border border-white/5 rounded-lg p-3 text-xs text-gray-400">
                                    <span className="font-bold text-white">BCA Computer Applications</span> | Government Degree College, Yadgir (2023 - 2026)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}