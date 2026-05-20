import { useEffect, useState, useRef } from 'react'
import { resumeAPI } from '../services/api'
import {
  Upload,
  FileText,
  Trash2,
  ExternalLink,
  Loader,
  File,
  Lightbulb,
  Sparkles // Added for the playground
} from 'lucide-react'
import toast from 'react-hot-toast'
// Import our new AI Button
import MagicRewriteButton from '../components/ui/resume/MagicRewriteButton'

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // State for the Magic Rewrite Playground
  const [testText, setTestText] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    try {
      const { data } = await resumeAPI.getAll()
      setResumes(data.data.resumes)
    } catch { toast.error('Failed to load resumes') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (file: File) => {
    if (!file) return
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(file.type)) return toast.error('Only PDF and DOCX files allowed')
    if (file.size > 5 * 1024 * 1024) return toast.error('File too large (max 5MB)')

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('resume', file)
      await resumeAPI.upload(fd)
      toast.success('Resume uploaded!')
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Upload failed')
    } finally { setUploading(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await resumeAPI.delete(id)
      toast.success('Deleted')
      setResumes(r => r.filter(x => x._id !== id))
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">My Resumes</h1>
        <p className="text-gray-500 text-sm mt-0.5">{resumes.length} resume{resumes.length !== 1 ? 's' : ''} uploaded</p>
      </div>

      {/* Upload zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-6 ${dragOver ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f) }}
      >
        <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]) }} />
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center mx-auto mb-3">
          {uploading ? <Loader size={18} className="text-blue-400 animate-spin" /> : <Upload size={18} className="text-blue-400" />}
        </div>
        <p className="font-semibold text-gray-200 text-sm">{uploading ? 'Uploading...' : 'Drop your resume here'}</p>
        <p className="text-gray-500 text-xs mt-1 font-mono">PDF or DOCX · Max 5MB</p>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : resumes.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          <File size={32} className="mx-auto mb-3 opacity-30" />
          <p>No resumes yet. Upload your first one above.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {resumes.map(r => (
              <div key={r._id} className="card p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${r.fileType === 'pdf' ? 'bg-red-500/15' : 'bg-blue-500/15'}`}>
                  <FileText size={18} className={r.fileType === 'pdf' ? 'text-red-400' : 'text-blue-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">{r.originalName}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {r.fileType?.toUpperCase()} · {(r.fileSize / 1024).toFixed(0)}KB · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs px-2 py-1.5">
                    <ExternalLink size={13} />
                  </a>
                  <button onClick={() => handleDelete(r._id, r.originalName)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FEATURE 3: Pro Tip Card */}
          {resumes.length === 1 && (
            <div className="mt-8 p-6 bg-[#13131A] border-l-4 border-amber-500/50 rounded-r-2xl flex items-start gap-4 animate-in fade-in slide-in-from-left-2">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 flex-shrink-0">
                <Lightbulb size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">Pro tip:</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Keep a separate tailored resume per company for best ATS results.
                  Most top candidates maintain 3-5 versions.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- MAGIC REWRITE PLAYGROUND --- */}
      <div className="mt-12 p-6 border border-purple-500/30 bg-purple-500/5 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-purple-400" size={20} />
          <h2 className="text-lg font-semibold text-purple-100">AI Magic Rewrite Sandbox</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">Test your new AI rewrite feature here. Type a weak bullet point and watch Groq improve it!</p>

        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">Work Experience Bullet Point</label>
          <MagicRewriteButton
            currentText={testText}
            jobTitle="Software Engineer"
            onRewrite={(newText) => setTestText(newText)}
          />
        </div>

        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="e.g., I made the website faster and fixed bugs."
          className="w-full bg-[#1A1A24] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
          rows={4}
        />
      </div>

    </div>
  )
}