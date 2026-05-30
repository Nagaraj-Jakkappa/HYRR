import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeAPI, scanAPI } from '../services/api'
import { useSocket } from '../hooks/useSocket'
import { Search, FileText, Building2, Briefcase, Loader, Zap, Database } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ScanPage() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState<any[]>([])
  const [savedJobs, setSavedJobs] = useState<any[]>([])
  const [form, setForm] = useState({
    resumeId: '',
    companyName: '',
    jobTitle: '',
    jobDescription: ''
  })

  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState({ step: 'Initializing scan configuration...', pct: 10 })
  const [scanId, setScanId] = useState<string | null>(null)

  // Use a mutable ref to hold the current scanId so background socket callbacks can evaluate it instantly without re-binding closures
  const scanIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Load User Resumes from API
    resumeAPI.getAll().then(({ data }) => {
      const fetchedResumes = data.data.resumes || []
      setResumes(fetchedResumes)
      if (fetchedResumes.length === 1) {
        setForm(f => ({ ...f, resumeId: fetchedResumes[0]._id }))
      }
    }).catch(() => toast.error("Failed to load resumes"))

    // Build Historical Job Library Options
    scanAPI.getAll().then(({ data }) => {
      const allScans = data.data.scans || []
      const uniqueJobs = allScans.reduce((acc: any[], current: any) => {
        const job = current.jobId
        if (!job) return acc
        const isDuplicate = acc.find(item =>
          item.jobTitle === job.jobTitle && item.companyName === job.companyName
        )
        if (!isDuplicate) acc.push(job)
        return acc
      }, [])
      setSavedJobs(uniqueJobs)
    }).catch(() => console.log("No previous scans discovered for library metrics"))
  }, [])

  // Auto-populate form when selecting a job template from historical library drop-down
  const handleLibrarySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    const job = savedJobs.find(j => j._id === selectedId)
    if (job) {
      setForm(f => ({
        ...f,
        companyName: job.companyName || '',
        jobTitle: job.jobTitle || '',
        jobDescription: job.jobDescription || ''
      }))
      toast.success('Job details loaded')
    }
  }

  // --- Real-time Socket Listener Handlers ---
  const onProgress = useCallback((d: any) => {
    // Check if the event data belongs to this active user scan
    if (d.scanId === scanIdRef.current) {
      setProgress({ step: d.step || 'Analyzing resume...', pct: d.pct || 40 })
    }
  }, [])

  const onDone = useCallback((d: any) => {
    if (d.scanId === scanIdRef.current) {
      toast.success(`Analysis complete! ATS Score: ${d.atsScore}`)
      setScanning(false)
      navigate(`/scan/results/${d.scanId}`)
    }
  }, [navigate])

  const onFailed = useCallback((d: any) => {
    if (d.scanId === scanIdRef.current) {
      toast.error('Scan failed: ' + d.message)
      setScanning(false)
    }
  }, [])

  // Registers real-time event hook definitions across live system channels
  useSocket('scan:progress', onProgress)
  useSocket('scan:done', onDone)
  useSocket('scan:failed', onFailed)

  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.resumeId) return toast.error('Please select a resume to scan.')
    if ((form.jobDescription?.length || 0) < 50) return toast.error('Please paste the full job description (at least 50 characters).')

    setScanning(true)
    setProgress({ step: 'Analyzing your resume against the job description...', pct: 15 })

    try {
      const { data } = await scanAPI.create(form)
      if (data?.success && data?.data?.scanId) {
        const activeId = data.data.scanId
        setScanId(activeId)
        scanIdRef.current = activeId
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to start scan. Please try again.')
      setScanning(false)
    }
  }

  // Visual Live Progress Component Layout Layout Output
  if (scanning) return (
    <div className="flex items-center justify-center h-full min-h-[450px]">
      <div className="text-center max-w-sm w-full p-6 bg-[#13131A]/80 backdrop-blur-xl border border-[#5B5FEF]/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(91,95,239,0.15)] relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#5B5FEF]/10 blur-3xl pointer-events-none rounded-full"></div>
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B5FEF]/20 to-[#8E5BEF]/20 flex items-center justify-center mx-auto mb-4 border border-[#5B5FEF]/30 shadow-[0_0_20px_rgba(91,95,239,0.2)] relative z-10">
          <Zap size={28} className="text-[#5B5FEF] animate-pulse" />
        </div>
        <h2 className="text-lg font-bold mb-2 text-white tracking-wide relative z-10">Scanning Resume</h2>
        <p className="text-sm text-gray-400 font-medium mb-6 min-h-[20px] relative z-10">{progress.step}</p>
        
        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative z-10">
          <div
            className="h-full bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(91,95,239,0.8)]"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <p className="text-xs text-[#5B5FEF] font-mono font-bold mt-3 relative z-10">{progress.pct}% optimized</p>
      </div>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New ATS Scan</h1>
        <p className="text-gray-400 text-sm mt-1">Upload a job description and compare it against your resume to see your true ATS match score.</p>
      </div>

      <form onSubmit={handleStartScan} className="space-y-5">
        <div className="card bg-[#13131A] p-4 sm:p-5 border border-white/5 rounded-2xl">
          <label className="label flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider mb-3 font-semibold">
            <FileText size={14} /> Select Resume
          </label>
          {resumes.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center bg-[#0A0A0F]/50 rounded-xl border border-white/5 border-dashed">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
                <FileText className="text-gray-500" size={20} />
              </div>
              <h3 className="text-sm font-semibold text-gray-300 mb-1">No Resumes Found</h3>
              <p className="text-xs text-gray-500 mb-4 max-w-[200px]">You need to create or upload a resume before scanning.</p>
              <button 
                type="button" 
                onClick={() => navigate('/builder')} 
                className="bg-[#5B5FEF]/10 hover:bg-[#5B5FEF]/20 text-[#5B5FEF] text-xs font-bold px-4 py-2 rounded-lg border border-[#5B5FEF]/30 transition-all"
              >
                Create Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resumes.map(r => (
                <label
                  key={r._id}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    form.resumeId === r._id 
                      ? 'border-[#5B5FEF] bg-[#5B5FEF]/10 shadow-[inset_0_0_0_1px_rgba(91,95,239,0.3)]' 
                      : 'border-white/[0.06] bg-[#0A0A0F]/50 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                >
                  <input
                    type="radio"
                    name="resume"
                    value={r._id}
                    checked={form.resumeId === r._id}
                    onChange={e => setForm(f => ({ ...f, resumeId: e.target.value }))}
                    className="hidden"
                  />
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    form.resumeId === r._id ? 'bg-[#5B5FEF] text-white shadow-md' : 'bg-white/5 text-gray-400'
                  }`}>
                    <FileText size={14} />
                  </div>
                  <span className={`text-sm flex-1 truncate transition-colors ${
                    form.resumeId === r._id ? 'font-bold text-white' : 'font-medium text-gray-300'
                  }`}>{r.originalName}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {savedJobs.length > 0 && (
          <div className="card bg-[#13131A] p-4 sm:p-5 border border-white/5 rounded-2xl">
            <label className="label flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider mb-3 font-semibold">
              <Database size={14} /> Use a Previous Job Description
            </label>
            <select
              onChange={handleLibrarySelect}
              className="w-full bg-[#0A0A0F]/50 border border-white/[0.06] rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/30 transition-all cursor-pointer hover:border-white/10"
              defaultValue=""
            >
              <option value="" disabled className="text-gray-500">Select a recent job...</option>
              {savedJobs.map(job => (
                <option key={job._id} value={job._id} className="bg-[#13131A] text-white">
                  {job.jobTitle} at {job.companyName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="card bg-[#13131A] p-4 sm:p-5 space-y-5 border border-white/5 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label text-gray-400 text-xs uppercase mb-2 flex items-center gap-1.5 font-bold tracking-wider">
                <Building2 size={14} /> Company Name
              </label>
              <input
                className="w-full bg-[#0A0A0F]/50 border border-white/[0.06] rounded-xl p-3.5 text-sm outline-none focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/30 transition-all text-white hover:border-white/10"
                placeholder="e.g. GoComet"
                value={form.companyName}
                onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label text-gray-400 text-xs uppercase mb-2 flex items-center gap-1.5 font-bold tracking-wider">
                <Briefcase size={14} /> Job Title
              </label>
              <input
                className="w-full bg-[#0A0A0F]/50 border border-white/[0.06] rounded-xl p-3.5 text-sm outline-none focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/30 transition-all text-white hover:border-white/10"
                placeholder="e.g. Frontend Engineer"
                value={form.jobTitle}
                onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="label text-gray-400 text-xs uppercase mb-2 flex items-center gap-1.5 font-bold tracking-wider">
              <Search size={14} /> Job Description
            </label>
            <textarea
              className="w-full bg-[#0A0A0F]/50 border border-white/[0.06] rounded-xl p-4 text-sm outline-none focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/30 transition-all resize-none text-gray-200 font-sans hover:border-white/10"
              rows={8}
              placeholder="Paste the full job description here..."
              value={form.jobDescription}
              onChange={e => setForm(f => ({ ...f, jobDescription: e.target.value }))}
              required
            />
            <p className="text-[10px] text-gray-500 mt-1.5 text-right font-medium">
              <span className={form.jobDescription?.length > 50 ? 'text-[#3DEBA6]' : 'text-amber-500'}>
                {form.jobDescription?.length || 0} characters
              </span>
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={scanning || !form.resumeId}
          className="flex items-center gap-2 bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] disabled:from-[#13131A] disabled:to-[#13131A] disabled:text-gray-500 disabled:border disabled:border-white/5 disabled:shadow-none text-white w-full justify-center py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(91,95,239,0.3)] hover:shadow-[0_0_25px_rgba(91,95,239,0.5)] active:scale-[0.99]"
        >
          {scanning ? <Loader size={18} className="animate-spin" /> : <Zap size={18} />}
          {scanning ? 'Scanning...' : 'Scan Resume'}
        </button>
      </form>
    </div>
  )
}