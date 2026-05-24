import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { scanAPI } from '../services/api'
import { Search, ExternalLink, Inbox, Clock, TrendingUp, Filter, Layers, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Scan {
  _id: string
  jobId: { companyName: string; jobTitle: string }
  resumeId: { originalName: string; fileType: string }
  atsScore: number
  keywordMatchPct: number
  status: string
  createdAt: string
}

type FilterType = 'ALL' | 'HIGH' | 'MID' | 'LOW'

const ScoreBadge = ({ score }: { score: number }) => {
  const safe = Number(score) || 0
  if (safe === 0) return (
    <span className="px-3 py-1 rounded-full text-xs font-mono border bg-white/5 border-white/10 text-[#6B6B7E]">—</span>
  )
  if (safe >= 80) return (
    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border bg-[#3DEBA6]/10 border-[#3DEBA6]/25 text-[#3DEBA6]">{safe}%</span>
  )
  if (safe >= 60) return (
    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border bg-[#F0C060]/10 border-[#F0C060]/25 text-[#F0C060]">{safe}%</span>
  )
  return (
    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border bg-[#ef4444]/10 border-[#ef4444]/25 text-[#ef4444]">{safe}%</span>
  )
}

const SkeletonRow = ({ isCompareMode }: { isCompareMode: boolean }) => (
  <tr className="border-b border-white/[0.04]">
    {isCompareMode && <td className="px-5 py-4"><div className="h-5 w-5 bg-white/5 rounded animate-pulse" /></td>}
    <td className="px-6 py-4">
      <div className="h-4 w-40 bg-white/5 rounded animate-pulse mb-2" />
      <div className="h-3 w-28 bg-white/[0.03] rounded animate-pulse" />
    </td>
    <td className="px-6 py-4"><div className="h-4 w-32 bg-white/5 rounded animate-pulse" /></td>
    <td className="px-6 py-4 text-center"><div className="h-6 w-14 bg-white/5 rounded-full animate-pulse mx-auto" /></td>
    <td className="px-6 py-4 text-center"><div className="h-3 w-20 bg-white/5 rounded animate-pulse mx-auto" /></td>
    <td className="px-6 py-4 text-right"><div className="h-4 w-16 bg-white/5 rounded animate-pulse ml-auto" /></td>
  </tr>
)

export default function HistoryPage() {
  const navigate = useNavigate()
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  // Compare Mode State
  const [isCompareMode, setIsCompareMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const fetchScans = useCallback(async (pageNum: number, replace: boolean) => {
    try {
      if (replace) setLoading(true)
      else setLoadingMore(true)

      const { data } = await scanAPI.getAll(pageNum)
      const incoming: Scan[] = (data.data.scans || []).filter((s: Scan) => s.status === 'done')

      setScans(prev => replace ? incoming : [...prev, ...incoming])
      setTotalPages(data.data.pages || 1)
      setTotal(data.data.total || 0)
    } catch (err: any) {
      toast.error('Failed to load scan history')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchScans(1, true)
  }, [fetchScans])

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id))
    } else {
      if (selectedIds.length >= 2) {
        toast.error("Deselect one scan first")
        return
      }
      setSelectedIds(prev => [...prev, id])
    }
  }

  const handleCompareAction = () => {
    navigate(`/compare?scan1=${selectedIds[0]}&scan2=${selectedIds[1]}`)
  }

  const filtered = scans.filter(scan => {
    const company = scan.jobId?.companyName?.toLowerCase() || ''
    const title = scan.jobId?.jobTitle?.toLowerCase() || ''
    const query = searchTerm.toLowerCase().trim()
    const matchesSearch = !query || company.includes(query) || title.includes(query)
    const score = Number(scan.atsScore) || 0

    if (filter === 'HIGH') return matchesSearch && score >= 80
    if (filter === 'MID') return matchesSearch && score >= 60 && score < 80
    if (filter === 'LOW') return matchesSearch && score > 0 && score < 60
    return matchesSearch
  })

  const filterCounts = {
    ALL: scans.length,
    HIGH: scans.filter(s => Number(s.atsScore) >= 80).length,
    MID: scans.filter(s => Number(s.atsScore) >= 60 && Number(s.atsScore) < 80).length,
    LOW: scans.filter(s => Number(s.atsScore) > 0 && Number(s.atsScore) < 60).length,
  }

  return (
    <div className="p-6 max-w-5xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#EEEEF0]">Scan History</h1>
          <p className="text-xs text-[#6B6B7E] font-mono mt-0.5">
            {loading ? 'Loading...' : `${total} total scan${total !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsCompareMode(!isCompareMode)
              setSelectedIds([])
            }}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all border ${isCompareMode
                ? 'bg-[#5B5FEF]/10 border-[#5B5FEF] text-[#5B5FEF]'
                : 'bg-[#13131A] border-white/[0.06] text-[#6B6B7E] hover:text-[#EEEEF0]'
              }`}
          >
            <Layers size={14} />
            {isCompareMode ? 'Cancel Selection' : 'Compare'}
          </button>
          <Link to="/scan" className="flex items-center gap-2 bg-[#5B5FEF] hover:bg-[#4a4edb] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all">
            <TrendingUp size={14} />
            New Scan
          </Link>
        </div>
      </div>

      {/* Floating Compare Button */}
      {selectedIds.length === 2 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#13131A] border border-[#5B5FEF] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#5B5FEF] flex items-center justify-center text-[10px] font-black border-2 border-[#13131A]">1</div>
              <div className="w-8 h-8 rounded-full bg-[#5B5FEF] flex items-center justify-center text-[10px] font-black border-2 border-[#13131A]">2</div>
            </div>
            <span className="text-xs font-mono font-bold text-[#EEEEF0]">Ready to Compare</span>
          </div>
          <button
            onClick={handleCompareAction}
            className="bg-[#5B5FEF] hover:bg-[#4a4edb] text-white text-xs font-black px-5 py-2 rounded-xl uppercase tracking-wider transition-all"
          >
            Compare Selected Scans
          </button>
        </div>
      )}

      {/* Search + Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B7E]" />
          <input
            type="text"
            placeholder="Search company or job title..."
            className="w-full bg-[#13131A] border border-white/[0.06] rounded-lg py-2.5 pl-9 pr-4 text-sm text-[#EEEEF0] placeholder-[#6B6B7E] focus:outline-none focus:border-[#5B5FEF]/50 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 bg-[#13131A] border border-white/[0.06] rounded-lg p-1">
          <Filter size={12} className="text-[#6B6B7E] mx-1.5" />
          {(['ALL', 'HIGH', 'MID', 'LOW'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${filter === f ? 'bg-[#5B5FEF] text-white' : 'text-[#6B6B7E] hover:text-[#EEEEF0]'
                }`}
            >
              {f} <span className="ml-1 opacity-60">({filterCounts[f]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#13131A] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {isCompareMode && <th className="w-12 px-5 py-3.5"></th>}
              <th className="px-5 py-3.5 text-left text-[10px] font-mono text-[#6B6B7E] uppercase tracking-wider">Company & Role</th>
              <th className="px-5 py-3.5 text-left text-[10px] font-mono text-[#6B6B7E] uppercase tracking-wider hidden sm:table-cell">Resume</th>
              <th className="px-5 py-3.5 text-center text-[10px] font-mono text-[#6B6B7E] uppercase tracking-wider">ATS Score</th>
              <th className="px-5 py-3.5 text-center text-[10px] font-mono text-[#6B6B7E] uppercase tracking-wider hidden md:table-cell">Date</th>
              <th className="px-5 py-3.5 text-right text-[10px] font-mono text-[#6B6B7E] uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {loading && [1, 2, 3].map(i => <SkeletonRow key={i} isCompareMode={isCompareMode} />)}

            {!loading && filtered.map(scan => (
              <tr
                key={scan._id}
                onClick={() => isCompareMode && handleSelect(scan._id)}
                className={`transition-colors group ${isCompareMode ? 'cursor-pointer hover:bg-[#5B5FEF]/5' : 'hover:bg-white/[0.015]'
                  } ${selectedIds.includes(scan._id) ? 'bg-[#5B5FEF]/10' : ''}`}
              >
                {isCompareMode && (
                  <td className="px-5 py-4">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedIds.includes(scan._id)
                        ? 'bg-[#5B5FEF] border-[#5B5FEF]'
                        : 'border-white/10 bg-[#0A0A0F]'
                      }`}>
                      {selectedIds.includes(scan._id) && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                  </td>
                )}

                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#EEEEF0] truncate max-w-[200px]">
                    {scan.jobId?.companyName || 'Unknown'}
                  </p>
                  <p className="text-xs text-[#6B6B7E] font-mono mt-0.5 truncate max-w-[200px]">
                    {scan.jobId?.jobTitle || 'Unknown Role'}
                  </p>
                </td>

                <td className="px-5 py-4 hidden sm:table-cell">
                  <p className="text-xs text-[#6B6B7E] font-mono truncate max-w-[160px]">
                    {scan.resumeId?.originalName || '—'}
                  </p>
                </td>

                <td className="px-5 py-4 text-center">
                  <ScoreBadge score={scan.atsScore} />
                </td>

                <td className="px-5 py-4 text-center hidden md:table-cell">
                  <span className="text-xs text-[#6B6B7E] font-mono flex items-center justify-center gap-1">
                    <Clock size={11} />
                    {new Date(scan.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/scan/results/${scan._id}`}
                    onClick={(e) => isCompareMode && e.preventDefault()}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${isCompareMode ? 'text-[#6B6B7E] cursor-not-allowed' : 'text-[#5B5FEF] hover:text-white'
                      }`}
                  >
                    View <ExternalLink size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}