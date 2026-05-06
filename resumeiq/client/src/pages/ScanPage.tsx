import { useEffect, useState, useCallback } from 'react'
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
  const [progress, setProgress] = useState({ step: '', pct: 0 })
  const [scanId, setScanId] = useState<string | null>(null)

  useEffect(() => {
    // Load Resumes
    resumeAPI.getAll().then(({ data }) => {
      const fetchedResumes = data.data.resumes || []
      setResumes(fetchedResumes)
      if (fetchedResumes.length === 1) {
        setForm(f => ({ ...f, resumeId: fetchedResumes[0]._id }))
      }
    }).catch(() => toast.error("Failed to load resumes"))

    // Build Job Library from Scan History
    scanAPI.getAll().then(({ data }) => {
      const allScans = data.data.scans || []
      // filter unique jobs by title and company
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
    }).catch(() => console.log("No previous scans found for library"))
  }, [])

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

  const onProgress = useCallback((d: any) => {
    setProgress({ step: d.step, pct: d.pct })
  }, [])

  const onDone = useCallback((d: any) => {
    if (d.scanId === scanId) {
      toast.success(`Analysis complete! ATS: ${d.atsScore}`)
      navigate(`/scan/${d.scanId}`)
    }
  }, [scanId, navigate])

  const onFailed = useCallback((d: any) => {
    if (d.scanId === scanId) {
      toast.error('Scan failed: ' + d.message)
      setScanning(false)
    }
  }, [scanId])

  useSocket('scan:progress', onProgress)
  useSocket('scan:done', onDone)
  useSocket('scan:failed', onFailed)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.resumeId) return toast.error('Select a resume first')
    if ((form.jobDescription?.length || 0) < 50) return toast.error('Description too short')

    setScanning(true)
    setProgress({ step: 'Starting scan...', pct: 10 })

    try {
      const { data } = await scanAPI.create(form)
      setScanId(data.data.scanId)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Scan failed')
      setScanning(false)
    }
  }

  if (scanning) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
          <Zap size={28} className="text-blue-400 animate-pulse" />
        </div>
        <h2 className="text-lg font-bold mb-2 text-white">Analyzing Your Resume</h2>
        <p className="text-sm text-gray-400 font-mono mb-6">{progress.step}</p>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress.pct}%` }} />
        </div>
        <p className="text-xs text-gray-600 font-mono mt-2">{progress.pct}% complete</p>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">New ATS Scan</h1>
        <p className="text-gray-500 text-sm mt-0.5">Analyze your resume against a job description</p>
      </div>

      <form onSubmit={handle} className="space-y-5">
        {/* Resume Selector */}
        <div className="card bg-[#13131A] p-4 border border-white/5 rounded-2xl">
          <label className="label flex items-center gap-1.5 text-gray-400 text-[10px] uppercase tracking-wider mb-3">
            <FileText size={12} /> Select Resume
          </label>
          {resumes.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">No resumes found. <a href="/resumes" className="text-blue-400 underline">Upload here</a></p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {resumes.map(r => (
                <label key={r._id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.resumeId === r._id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'}`}>
                  <input type="radio" name="resume" value={r._id} checked={form.resumeId === r._id} onChange={e => setForm(f => ({ ...f, resumeId: e.target.value }))} className="hidden" />
                  <FileText size={14} className={form.resumeId === r._id ? 'text-blue-400' : 'text-gray-500'} />
                  <span className="text-sm flex-1 truncate">{r.originalName}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Job Library Dropdown */}
        {savedJobs.length > 0 && (
          <div className="card bg-[#13131A] p-4 border border-white/5 rounded-2xl">
            <label className="label flex items-center gap-1.5 text-gray-400 text-[10px] uppercase tracking-wider mb-2">
              <Database size={12} /> Load from Library
            </label>
            <select
              onChange={handleLibrarySelect}
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-sm text-gray-300 outline-none focus:border-blue-500"
              defaultValue=""
            >
              <option value="" disabled>Choose a previous job...</option>
              {savedJobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.jobTitle} at {job.companyName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Form Inputs */}
        <div className="card bg-[#13131A] p-4 space-y-4 border border-white/5 rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label text-gray-400 text-[10px] uppercase mb-1 flex items-center gap-1">
                <Building2 size={12} /> Company
              </label>
              <input className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" placeholder="e.g. GoComet" value={form.companyName}
                onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} required />
            </div>
            <div>
              <label className="label text-gray-400 text-[10px] uppercase mb-1 flex items-center gap-1">
                <Briefcase size={12} /> Title
              </label>
              <input className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" placeholder="e.g. Developer" value={form.jobTitle}
                onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="label text-gray-400 text-[10px] uppercase mb-1 flex items-center gap-1">
              <Search size={12} /> Job Description
            </label>
            <textarea className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 resize-none" rows={8} placeholder="Paste details..."
              value={form.jobDescription} onChange={e => setForm(f => ({ ...f, jobDescription: e.target.value }))} required />
            <p className="text-[10px] text-gray-600 font-mono mt-1">
              {form.jobDescription?.length || 0} characters
            </p>
          </div>
        </div>

        <button type="submit" disabled={scanning || !form.resumeId} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white w-full justify-center py-3 rounded-xl text-sm font-bold transition-all">
          {scanning ? <Loader size={15} className="animate-spin" /> : <Zap size={15} />}
          {scanning ? 'Analyzing...' : 'Run ATS Analysis'}
        </button>
      </form>
    </div>
  )
}