import React, { useEffect, useState, useRef } from 'react';
import { resumeAPI } from '../services/api';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  FileText,
  Trash2,
  ExternalLink,
  Loader,
  File,
  Lightbulb,
  Zap,
  ArrowRight,
  MoreVertical,
  ScanSearch
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await resumeAPI.getAll();
      setResumes(data.data.resumes);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) return toast.error('Only PDF and DOCX files allowed');
    if (file.size > 5 * 1024 * 1024) return toast.error('File too large (max 5MB)');

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      await resumeAPI.upload(fd);
      toast.success('Resume uploaded successfully!');
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await resumeAPI.delete(id);
      toast.success('Resume deleted');
      setResumes(r => r.filter(x => x._id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleViewFile = async (resumeId: string) => {
    try {
      const { data } = await api.get(`/resumes/${resumeId}/view`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(data);
      window.open(url, '_blank');
    } catch {
      toast.error('Failed to open file');
    }
  };

  const handleQuickScan = (id: string) => {
    // Navigate to scan page and pass the selected resume ID in the location state
    navigate('/scan', { state: { preSelectedResumeId: id } });
  };

  return (
    <div className="flex-1 bg-[#0A0A0F] text-[#EEEEF0] p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">My Resumes</h1>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
            {resumes.length} document{resumes.length !== 1 ? 's' : ''} stored securely
          </p>
        </header>

        {/* --- HERO ACTION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          
          {/* Action 1: Upload Existing */}
          <div
            className={`relative bg-[#13131A] rounded-[32px] border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group
              ${dragOver ? 'border-[#5B5FEF] bg-[#5B5FEF]/5' : 'border-white/10 hover:border-white/20'}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
          >
            <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
            
            <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-[#5B5FEF]/10 flex items-center justify-center mb-4 transition-colors">
              {uploading ? <Loader size={28} className="text-[#5B5FEF] animate-spin" /> : <Upload size={28} className="text-[#5B5FEF] group-hover:scale-110 transition-transform" />}
            </div>
            <h3 className="text-xl font-bold mb-2">{uploading ? 'Uploading...' : 'Upload Existing Resume'}</h3>
            <p className="text-gray-500 text-sm max-w-[200px] mb-4">Drag and drop your PDF or DOCX file here.</p>
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/5">
              MAX 5MB
            </span>
          </div>

          {/* Action 2: Build From Scratch */}
          <Link 
            to="/builder"
            className="relative bg-gradient-to-br from-[#13131A] to-[#0A0A0F] rounded-[32px] border border-[#3DEBA6]/20 p-8 flex flex-col justify-between overflow-hidden group transition-all duration-300 hover:border-[#3DEBA6]/40 shadow-lg hover:shadow-[#3DEBA6]/10"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
              <Zap size={120} />
            </div>
            
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#3DEBA6]/10 flex items-center justify-center mb-6 border border-[#3DEBA6]/20">
                <FileText size={28} className="text-[#3DEBA6]" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Build from Scratch</h3>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                Use our AI-powered builder to create a perfectly formatted, ATS-compliant resume tailored directly to your target industry.
              </p>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-[#3DEBA6] font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
              Launch Builder <ArrowRight size={16} />
            </div>
          </Link>

        </div>

        {/* --- PRO TIP --- */}
        {resumes.length === 1 && (
          <div className="mb-12 p-6 bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 rounded-r-2xl flex items-start gap-4">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500 flex-shrink-0">
              <Lightbulb size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1 tracking-widest uppercase">Pro tip</p>
              <p className="text-sm text-amber-200/70 leading-relaxed max-w-2xl">
                Keep a separate tailored resume per company for best ATS results. Most top candidates maintain 3-5 distinct versions for different roles.
              </p>
            </div>
          </div>
        )}

        {/* --- RESUME LIBRARY --- */}
        <div>
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <h2 className="text-xl font-bold">Document Library</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#5B5FEF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="border border-white/5 bg-[#13131A] rounded-[32px] p-16 text-center text-gray-500">
              <File size={48} className="mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-bold text-gray-400 mb-2">Your library is empty</h3>
              <p className="text-sm">Upload or build your first resume to start analyzing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map(resume => (
                <div 
                  key={resume._id} 
                  className="bg-[#13131A] border border-white/5 rounded-[24px] p-6 hover:border-[#5B5FEF]/30 transition-all duration-300 group flex flex-col justify-between"
                  onMouseLeave={() => setActiveMenuId(null)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${resume.fileType === 'pdf' ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#5B5FEF]/10 border border-[#5B5FEF]/20'}`}>
                      <FileText size={20} className={resume.fileType === 'pdf' ? 'text-red-400' : 'text-[#5B5FEF]'} />
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === resume._id ? null : resume._id)}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeMenuId === resume._id && (
                        <div className="absolute right-0 top-full mt-2 w-36 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl py-1 z-10 animate-in fade-in zoom-in-95 duration-150">
                          <button 
                            onClick={() => handleViewFile(resume._id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                          >
                            <ExternalLink size={14} /> View File
                          </button>
                          <button 
                            onClick={() => handleDelete(resume._id, resume.originalName)} 
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-100 truncate mb-1" title={resume.originalName}>
                      {resume.originalName}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-6">
                      <span className="px-2 py-0.5 rounded-full bg-white/5">{resume.fileType?.toUpperCase()}</span>
                      <span>{(resume.fileSize / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleQuickScan(resume._id)}
                    className="w-full bg-[#5B5FEF]/10 hover:bg-[#5B5FEF] text-[#5B5FEF] hover:text-white border border-[#5B5FEF]/20 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <ScanSearch size={16} className="group-hover/btn:scale-110 transition-transform" /> Quick Scan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}