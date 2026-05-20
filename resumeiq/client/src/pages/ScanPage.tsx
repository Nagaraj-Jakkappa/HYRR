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
      toast.success('Job metadata structural properties loaded')
    }
  }

  // --- Real-time Socket Listener Handlers ---
  const onProgress = useCallback((d: any) => {
    // Check if the event data belongs to this active user scan
    if (d.scanId === scanIdRef.current) {
      setProgress({ step: d.step || 'Running AI computations...', pct: d.pct || 40 })
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
      toast.error('Scan optimization run halted: ' + d.message)
      setScanning(false)
    }
  }, [])

  // Registers real-time event hook definitions across live system channels
  useSocket('scan:progress', onProgress)
  useSocket('scan:done', onDone)
  useSocket('scan:failed', onFailed)

  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.resumeId) return toast.error('Please isolate a target data model resume reference point.')
    if ((form.jobDescription?.length || 0) < 50) return toast.error('Target criteria profiles text field string parameter details are too sparse.')

    setScanning(true)
    setProgress({ step: 'Registering asynchronous transaction layers...', pct: 15 })

    try {
      const { data } = await scanAPI.create(form)
      if (data?.success && data?.data?.scanId) {
        const activeId = data.data.scanId
        setScanId(activeId)
        scanIdRef.current = activeId
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Asynchronous tracking framework allocation aborted.')
      setScanning(false)
    }
  }

  // Visual Live Progress Component Layout Layout Output
  if (scanning) return (
    <div className="flex items-center justify-center h-full min-h-[450px]">
      <div className="text-center max-w-sm w-full p-6 bg-[#13131A] border border-white/5 rounded-2xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mx-auto mb-4 border border-blue-500/10">
          <Zap size={28} className="text-blue-400 animate-pulse" />
        </div>
        <h2 className="text-lg font-bold mb-2 text-white tracking-wide">Analyzing Your Resume</h2>
        <p className="text-sm text-gray-400 font-mono mb-6 min-h-[20px]">{progress.step}</p>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(59,130,246,0.5)]"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 font-mono mt-2.5">{progress.pct}% complete</p>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">New ATS Scan</h1>
        <p className="text-gray-500 text-sm mt-0.5">Analyze your resume structural properties against job profiles metric dimensions instantly.</p>
      </div>

      <form onSubmit={handleStartScan} className="space-y-5">
        {/* Resume Selector Card */}
        <div className="card bg-[#13131A] p-4 border border-white/5 rounded-2xl">
          <label className="label flex items-center gap-1.5 text-gray-400 text-[10px] uppercase tracking-wider mb-3 font-semibold">
            <FileText size={12} /> Select Target Resume Profile
          </label>
          {resumes.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">
              No matching profiles extracted. <a href="/resumes" className="text-blue-400 underline hover:text-blue-300">Upload document models here</a>
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {resumes.map(r => (
                <label
                  key={r._id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.resumeId === r._id ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-[#0A0A0F]/50 hover:border-white/20'
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
                  <FileText size={14} className={form.resumeId === r._id ? 'text-blue-400' : 'text-gray-500'} />
                  <span className="text-sm flex-1 truncate font-medium">{r.originalName}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Saved Jobs Template Library Option Card */}
        {savedJobs.length > 0 && (
          <div className="card bg-[#13131A] p-4 border border-white/5 rounded-2xl">
            <label className="label flex items-center gap-1.5 text-gray-400 text-[10px] uppercase tracking-wider mb-2 font-semibold">
              <Database size={12} /> Load From Historical Schema Index Library
            </label>
            <select
              onChange={handleLibrarySelect}
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-2.5 text-sm text-gray-300 outline-none focus:border-blue-500 transition-all cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>Select previous tracking target criteria properties...</option>
              {savedJobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.jobTitle} at {job.companyName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Input Text Form Parameters Controls Card */}
        <div className="card bg-[#13131A] p-4 space-y-4 border border-white/5 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-gray-400 text-[10px] uppercase mb-1.5 flex items-center gap-1 font-semibold">
                <Building2 size={12} /> Company Name
              </label>
              <input
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 transition-all text-white"
                placeholder="e.g. GoComet"
                value={form.companyName}
                onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label text-gray-400 text-[10px] uppercase mb-1.5 flex items-center gap-1 font-semibold">
                <Briefcase size={12} /> Job Title Target
              </label>
              <input
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 transition-all text-white"
                placeholder="e.g. Frontend Engineer"
                value={form.jobTitle}
                onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="label text-gray-400 text-[10px] uppercase mb-1.5 flex items-center gap-1 font-semibold">
              <Search size={12} /> Full Job Description Text Parameters
            </label>
            <textarea
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 transition-all resize-none text-white font-sans"
              rows={8}
              placeholder="Paste raw target structural vacancy posting description texts here directly..."
              value={form.jobDescription}
              onChange={e => setForm(f => ({ ...f, jobDescription: e.target.value }))}
              required
            />
            <p className="text-[10px] text-gray-600 font-mono mt-1 text-right">
              {form.jobDescription?.length || 0} characters mapped
            </p>
          </div>
        </div>

        {/* Process Dispatched Execution Control Trigger */}
        <button
          type="submit"
          disabled={scanning || !form.resumeId}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white w-full justify-center py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/5 active:scale-[0.99]"
        >
          {scanning ? <Loader size={15} className="animate-spin" /> : <Zap size={15} />}
          {scanning ? 'Processing System Execution Run...' : 'Run ATS Analysis'}
        </button>
      </form>
    </div>
  )
}