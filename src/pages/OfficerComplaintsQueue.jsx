import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN IDENTITY:
// This page belongs to an officer — not a passive viewer but an active decision maker.
// Visual language: dark command-bar header, tight information density, action-forward.
// Every row communicates urgency. The drawer is a "workbench" not a "detail view".
// Color system stays consistent with project but uses slate-900 headers like OfficerDashboard.
// ─────────────────────────────────────────────────────────────────────────────

// ── Bug fixes from your original code ────────────────────────────────────────
// LEARNING: You wrote `useSelector(null)` for hoveredRow and selectedComplaint.
// useSelector is a Redux hook — it reads from the Redux store.
// useState is the correct hook for local component state.
// These two are completely different things. Never mix them up.

// ── Filter tabs config ────────────────────────────────────────────────────────
const FILTER_TABS = [
  { key: 'all',         label: 'All'         },
  { key: 'pending',     label: 'Pending'     },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved',    label: 'Resolved'    },
  { key: 'rejected',    label: 'Rejected'    },
]

// ── Status config — single source of truth for badge styling ─────────────────
// LEARNING: Define config like this once at the top of the file.
// Every component in this file can use it — no duplication.
const STATUS_CONFIG = {
  pending:     { label: 'Pending',     pill: 'bg-amber-50 text-amber-700 border border-amber-200',    dot: 'bg-amber-400',   row: 'border-l-amber-400'   },
  in_progress: { label: 'In Progress', pill: 'bg-blue-50 text-[#1C49BD] border border-blue-200',      dot: 'bg-blue-500',    row: 'border-l-[#1C49BD]'   },
  resolved:    { label: 'Resolved',    pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500', row: 'border-l-emerald-500'  },
  rejected:    { label: 'Rejected',    pill: 'bg-rose-50 text-rose-600 border border-rose-200',        dot: 'bg-rose-500',    row: 'border-l-rose-400'    },
}

// ── Priority config ───────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  high:   { label: 'High',   cls: 'bg-rose-100 text-rose-700 border border-rose-200',       dot: 'bg-rose-500'    },
  medium: { label: 'Medium', cls: 'bg-amber-100 text-amber-700 border border-amber-200',    dot: 'bg-amber-400'   },
  low:    { label: 'Low',    cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
}

// ── Date formatter ────────────────────────────────────────────────────────────
const formatDate = (rawDate) => {
  if (!rawDate) return '—'
  return new Date(rawDate).toLocaleDateString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Filter: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  ),
  Paperclip: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
    </svg>
  ),
  User: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  ),
  Close: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
    </svg>
  ),
  Send: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
    </svg>
  ),
  Zap: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Clock: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/>
    </svg>
  ),
  Image: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  MessageSquare: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE ILLUSTRATION
// ─────────────────────────────────────────────────────────────────────────────
const EmptyQueueIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32">
    <rect x="40" y="30" width="120" height="90" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5"/>
    <rect x="55" y="50" width="90" height="8" rx="4" fill="#e2e8f0"/>
    <rect x="55" y="65" width="60" height="6" rx="3" fill="#f1f5f9"/>
    <rect x="55" y="78" width="75" height="6" rx="3" fill="#f1f5f9"/>
    <circle cx="155" cy="105" r="22" fill="#1C49BD" opacity="0.08" stroke="#1C49BD" strokeWidth="1.5" strokeDasharray="4 2"/>
    <path d="M148 105h14M155 98v14" stroke="#1C49BD" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="55" cy="120" r="4" fill="#e2e8f0"/>
    <circle cx="70" cy="125" r="2.5" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1"/>
  </svg>
)


// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function OfficerComplaintsQueue() {

  const token = localStorage.getItem('userToken')
  const { reduxUser } = useSelector((state) => state.auth)

  const bankName   = reduxUser?.bank_id?.bankName || 'Your Bank'
  const officerName = reduxUser?.name || 'Officer'

  // LEARNING: These MUST be useState, not useSelector.
  // useState = local UI state (hover, open/close, selected item)
  // useSelector = reading data FROM the Redux global store
  const [officerComplaints, setOfficerComplaints] = useState([])
  const [activeFilter,      setActiveFilter]      = useState('all')
  const [hoveredRow,        setHoveredRow]         = useState(null)
  const [selectedComplaint, setSelectedComplaint]  = useState(null)
  const [isDrawerOpen,      setIsDrawerOpen]       = useState(false)
  const [isLoading,         setIsLoading]          = useState(true)

  // ── API call ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/complaint/bankComplaints`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log("Respoonse Of Fetching Complaints: " , res.data)
        setOfficerComplaints(res.data?.bankComplaints ?? [])
        toast.success(res.data.message, { 
          style: { 
            minWidth: '350px',
            maxWidth: "700px"
        }})
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to load complaints",
          { 
            style: { 
              minWidth: "350px",
              maxWidth: "700px"
          }},
        );
      } finally {
        // LEARNING: finally block runs whether try succeeded or failed.
        // Perfect for cleanup like turning off a loading spinner.
        setIsLoading(false)
      }
    }
    fetchComplaints()
  }, [])

  // ── Stats — tab badge counts ───────────────────────────────────────────────
  const stats = useMemo(() => ({
    all:         officerComplaints.length,
    pending:     officerComplaints.filter(c => c.status === 'pending').length,
    in_progress: officerComplaints.filter(c => c.status === 'in_progress').length,
    resolved:    officerComplaints.filter(c => c.status === 'resolved').length,
    rejected:    officerComplaints.filter(c => c.status === 'rejected').length,
  }), [officerComplaints])

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filteredData = useMemo(() =>
    activeFilter === 'all'
      ? officerComplaints
      : officerComplaints.filter(c => c.status === activeFilter),
    [activeFilter, officerComplaints]
  )

  // ── Handler: open drawer with selected complaint ───────────────────────────
  const handleTakeAction = (complaint) => {
    setSelectedComplaint(complaint)
    setIsDrawerOpen(true)
  }

  // ── Handler: close drawer + refresh list after update ─────────────────────
  // LEARNING: After an officer updates a complaint, we refetch the list
  // so the table reflects the new status immediately without a page reload.
  const handleDrawerClose = (didUpdate = false) => {
    setIsDrawerOpen(false)
    setSelectedComplaint(null)
    if (didUpdate) {
      // Re-trigger useEffect by refetching
      // Simple approach: call the fetch function directly
      const refetch = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/complaint/bankComplaints`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          setOfficerComplaints(res.data?.bankComplaints ?? [])
        } catch (_) {}
      }
      refetch()
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ═══════════════════════════════════════════════════════════════════
          HEADER BANNER — dark, authoritative, officer-identity
          Carries bank name + total queue count + officer name
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative rounded-2xl bg-slate-900 overflow-hidden px-6 py-5 md:px-8 md:py-6">
        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white, white 1px, transparent 1px, transparent 12px)'
        }}/>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1C49BD]/15 rounded-full blur-3xl pointer-events-none"/>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb-style label */}
            <div className="flex items-center gap-2 mb-1 rounded-2xl px-2 py-0.75 w-fit border-0 border-[#5EE9B5] bg-[#5EE9B5]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-emerald-400 text-[11px] font-bold uppercase tracking-widest">Live Queue</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Complaint Queue
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              <span className="text-slate-300 font-semibold">{bankName}</span>
              {' · '}Assigned to <span className='px-1 italic font-bold  tracking-wider text-slate-300'>{officerName}</span>
            </p>
          </div>

          {/* Right: queue summary pills */}
          <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-center ">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total</p>
              <p className="text-xl font-extrabold text-white">{stats.all}</p>
            </div>
            <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center ">
              <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Pending</p>
              <p className="text-xl font-extrabold text-amber-300">{stats.pending}</p>
            </div>
            <div className="px-3 py-2 bg-[#1C49BD]/20 border border-[#1C49BD]/30 rounded-xl text-center ">
              <p className="text-[10px] text-sky-400 uppercase tracking-widest font-bold">Active</p>
              <p className="text-xl font-extrabold text-sky-300">{stats.in_progress}</p>
            </div>
            <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center ">
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Done</p>
              <p className="text-xl font-extrabold text-emerald-300">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TABLE CARD
      ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* ── Filter Tabs ─────────────────────────────────────────────── */}
        <div className="px-5 pt-4 border-b border-slate-300">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-0">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.key
              const count = stats[tab.key] ?? 0
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 text-xs font-semibold
                    rounded-t-lg border-b-2 transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? 'border-[#1C49BD] text-[#1C49BD] bg-blue-50/95'
                      : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                    ${isActive ? 'bg-[#1C49BD] text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              )
            })}

            {/* Right-aligned record count */}
            <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-500 font-medium shrink-0 pl-4 pb-2">
              <Icons.Filter />
              {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* ── Loading skeleton ────────────────────────────────────────── */}
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse flex gap-4 items-center">
                <div className="h-10 bg-slate-100 rounded-xl flex-1"/>
                <div className="h-10 bg-slate-100 rounded-xl w-24"/>
                <div className="h-10 bg-slate-100 rounded-xl w-32"/>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────────────── */}
        {!isLoading && filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            <EmptyQueueIllustration />
            <h3 className="text-base font-bold text-slate-700 mt-3">Queue is clear</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">
              No complaints match this filter. All caught up or try a different status.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#1C49BD] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              View all complaints
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            DESKTOP TABLE
            LEARNING: The left colored border on each row (border-l-4) is
            a visual trick to communicate status at a glance — before the
            user even reads the badge. High-information-density UX pattern.
        ═════════════════════════════════════════════════════════════ */}
        {!isLoading && filteredData.length > 0 && (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-300">
                    {['Customer / Tracking Id', 'Category & Description', 'Priority', 'Status', 'Filed On', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredData.map((c) => {
                    const statusCfg   = STATUS_CONFIG[c.status]   || STATUS_CONFIG.pending
                    const priorityCfg = PRIORITY_CONFIG[c.priority] || PRIORITY_CONFIG.medium
                    const isFraud     = c.category?.toLowerCase().includes('fraud')

                    return (
                      <tr
                        key={c._id}
                        onMouseEnter={() => setHoveredRow(c._id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={`
                          border-l-4 ${statusCfg.row}
                          transition-colors duration-150
                          ${hoveredRow === c._id ? 'bg-slate-50' : 'bg-white'}
                        `}
                      >
                        {/* Col 1: Customer + Tracking ID */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            {/* Customer initials avatar */}
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-extrabold text-slate-500 shrink-0">
                              {c.customerID?.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700">
                                {c.customerID?.name || 'Customer'}
                              </p>
                              <p className="text-[11px] text-[#1C49BD] font-mono mt-0.5">
                                {c.trackingID}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Col 2: Category + description */}
                        <td className="px-4 py-3.5 max-w-[200px]">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-xs font-bold text-slate-700 truncate">{c.category}</span>
                            {/* Fraud flag */}
                            {isFraud && (
                              <span className="shrink-0 text-rose-500" title="Fraud related">
                                <Icons.AlertTriangle />
                              </span>
                            )}
                            {/* Media indicator */}
                            {c.media && (
                              <span className="shrink-0 text-slate-400" title="Has attachment">
                                <Icons.Paperclip />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate cursor-pointer" title={c.description}>{c.description}</p>
                        </td>

                        {/* Col 3: Priority */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${priorityCfg.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot} animate-pulse`}/>
                            {priorityCfg.label}
                          </span>
                        </td>

                        {/* Col 4: Status */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${statusCfg.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`}/>
                            {statusCfg.label}
                          </span>
                        </td>

                        {/* Col 5: Date */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs text-[#1C49BD] font-medium">
                            <Icons.Clock />
                            {formatDate(c.createdAt)}
                          </div>
                        </td>

                        {/* Col 6: Take Action button */}
                        {/* LEARNING: The onClick changes TWO states — selectedComplaint
                            stores the full object, isDrawerOpen triggers the render.
                            Both must happen together so the drawer always has data. */}
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => handleTakeAction(c)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-[#1C49BD] text-white text-xs font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/30 group"
                          >
                            <Icons.Zap />
                            Take Action
                            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                              <Icons.ChevronRight />
                            </span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ══════════════════════════════════════════════════════════
                MOBILE CARDS — each complaint is a compact action card
            ══════════════════════════════════════════════════════════ */}
            <div className="lg:hidden divide-y divide-slate-300">
              {filteredData.map((c) => {
                const statusCfg   = STATUS_CONFIG[c.status]    || STATUS_CONFIG.pending
                const priorityCfg = PRIORITY_CONFIG[c.priority] || PRIORITY_CONFIG.medium
                const isFraud     = c.category?.toLowerCase().includes('fraud')

                return (
                  <div key={c._id} className={`p-4 border-l-4 ${statusCfg.row}`}>
                    {/* Row 1: customer + tracking */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-[10.5px] font-extrabold text-slate-500 shrink-0">
                          {c.customerID?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{c.customerID?.name || 'Customer'}</p>
                          <p className="text-[10.5px] text-[#1C49BD] font-mono">{c.trackingID}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${statusCfg.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`}/>
                        {statusCfg.label}
                      </span>
                    </div>

                    {/* Row 2: category */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-bold text-slate-700">{c.category}</span>
                      {isFraud && <span className="text-rose-500"><Icons.AlertTriangle /></span>}
                      {c.media && <span className="text-slate-400"><Icons.Paperclip /></span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2 line-clamp-2">{c.description}</p>

                    {/* Row 3: priority + date + action */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityCfg.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot} animate-pulse`}/>
                          {priorityCfg.label}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Icons.Clock /> {formatDate(c.createdAt)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleTakeAction(c)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-[#1C49BD] text-white text-[11px] font-bold rounded-xl transition-all duration-200"
                      >
                        <Icons.Zap /> Action
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Table footer */}
            <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <p className="text-[11px] text-slate-400 ">
                {filteredData.length} of {officerComplaints.length} complaints
              </p>
              <p className="text-[11px] text-slate-400 font-medium">SBP Monitored 🇵🇰</p>
            </div>
          </>
        )}
      </div>

      {/* ── Drawer — only renders when open ────────────────────────────── */}
      {isDrawerOpen && selectedComplaint && (
        <ComplaintsQueueDrawer
          complaint={selectedComplaint}
          onClose={handleDrawerClose}
        />
      )}
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// ACTION DRAWER COMPONENT
// This is an officer's WORKBENCH — not a read-only view.
// It is split into two zones:
//   TOP: Read-only complaint context (who filed, what, when)
//   BOTTOM: Editable action zone (status, priority, remark)
// ─────────────────────────────────────────────────────────────────────────────
function ComplaintsQueueDrawer({ complaint, onClose }) {

  const token = localStorage.getItem('userToken')

  // ── Pre-fill form with complaint's current values ─────────────────────────
  // LEARNING: Initializing state with the complaint's existing values is UX-friendly.
  // The officer sees the current state first, then changes only what they need.
  const [statusState,   setStatusState]   = useState(complaint.status   || 'pending')
  const [priorityState, setPriorityState] = useState(complaint.priority || 'medium')
  const [noteState,     setNoteState]     = useState('')
  const [isSubmitting,  setIsSubmitting]  = useState(false)

  const statusCfg   = STATUS_CONFIG[complaint.status]    || STATUS_CONFIG.pending
  const priorityCfg = PRIORITY_CONFIG[complaint.priority] || PRIORITY_CONFIG.medium

  const customerName  = complaint.customerID?.name  || 'Customer'
  const customerEmail = complaint.customerID?.email || 'abc123@xyz.com'
  const bankName      = complaint.bankID?.bankName   || 'Unknown Bank'
  const isFraud       = complaint.category?.toLowerCase().includes('fraud')
  const isNeverUpdated =
    new Date(complaint.createdAt).getTime() === new Date(complaint.updatedAt).getTime()

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!noteState.trim()) {
      toast.error('Please add a remark before submitting.' , {
      style : {
        minWidth : "350px" ,
        maxWidth: "700px"
      }
    })
      return 
    }
    setIsSubmitting(true)
    console.log("Complaint ID: " , complaint._id);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaint/updateComplaint/${complaint._id}`,
        { 
          status: statusState,
          priority: priorityState,
          note: noteState 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data?.message || "Complaint updated!", {
        style: { minWidth: "350px" , maxWidth: "700px" },
      });
      // LEARNING: Pass `true` to onClose to signal "data changed — please refetch"
      onClose(true)
    } catch (err) {
      console.log("Error: " , err.response.data);
      toast.error(err.response?.data?.message || 'Update failed. Try again.', { style: { minWidth: '350px', maxWidth: "700px" } })
    } finally {
      setIsSubmitting(false)
    }
  }

  const lastRemark = complaint.remarks?.length > 0
    ? complaint.remarks[complaint.remarks.length - 1]
    : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 h-full"
        onClick={() => onClose(false)}
      />

      {/* Drawer panel */}
      <aside
        className={`
          fixed z-50 bg-white flex flex-col overflow-hidden shadow-2xl
          bottom-0 left-0 right-0 h-[94vh] rounded-t-3xl
          md:top-0 md:bottom-auto md:left-auto md:right-0
          md:h-full md:w-[500px] md:rounded-none md:rounded-l-3xl
          drawer-slide-in
        `}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* ── DRAWER HEADER — dark like page header ─────────────────────── */}
        <div className="shrink-0 bg-slate-900 px-5 py-4 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, white, white 1px, transparent 1px, transparent 10px)",
            }}
          />
          <div className="absolute right-0 top-0 w-40 h-40 bg-[#1C49BD]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Action Desk
                </span>
                {isFraud && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 border border-rose-500/30 rounded-full text-[10px] font-bold text-rose-400">
                    <Icons.AlertTriangle /> Fraud Alert
                  </span>
                )}
              </div>
              <h2 className="text-white font-extrabold text-lg font-mono truncate">
                {complaint.trackingID}
              </h2>
              <p className="text-slate-300 text-[12.5px] mt-0.5 italic truncate">
                {bankName}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0 mr-7">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${statusCfg.pill}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`}
                />
                {statusCfg.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityCfg.cls}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot}`}
                />
                {priorityCfg.label}
              </span>
            </div>
          </div>

          <button
            onClick={() => onClose(false)}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/25 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <Icons.Close />
          </button>
        </div>

        {/* ── SCROLLABLE BODY ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* ── ZONE 1: READ-ONLY CONTEXT ─────────────────────────────── */}
          <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Complaint Context
            </p>

            {/* Customer info */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-[#1C49BD] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {customerName}
                </p>
                <p className="text-xs text-slate-400">{customerEmail}</p>
              </div>
              <div className="ml-auto text-slate-400">
                <Icons.User />
              </div>
            </div>

            {/* Key details grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { 
                  label: "Category", 
                  value: complaint.category,
                  mono: false 
                },
                {
                  label: "Filed On",
                  value: formatDate(complaint.createdAt),
                  mono: true,
                },
                {
                  label: "Last Action",
                  value: isNeverUpdated
                    ? "Not yet"
                    : formatDate(complaint.updatedAt),
                  mono: !isNeverUpdated,
                  muted: isNeverUpdated,
                },
                {
                  label: "Remarks",
                  value: `${complaint.remarks?.length || 0} posted`,
                  mono: false,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl border border-slate-200 px-3 py-2.5"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p
                    className={`text-xs font-semibold
                      ${item.mono ? "font-mono text-[#1C49BD] text-[13.4px]" : ""}
                      ${item.muted ? "text-slate-400 italic" : (!item.mono ? "text-slate-700" : "") }
                      ${item.label === "Category" ? "italic" : ""} 
                      `}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Description
              </p>
              <div className="border-l-3 border-[#1C49BD]/40 pl-3">
                <p className="text-xs text-slate-700 leading-relaxed font-medium wrap-break-word ">
                  {complaint.description}
                </p>
              </div>
            </div>

            {/* Media */}
            {complaint.media && typeof complaint.media === "string" && (
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-2">
                  <span className="text-slate-400">
                    <Icons.Image />
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Evidence Attached
                  </span>
                </div>
                <img
                  src={complaint.media}
                  alt="Evidence"
                  className="w-full h-40 object-cover"
                />
              </div>
            )}

            {/* Last remark preview */}
            {lastRemark && (
              <div className="bg-white rounded-xl border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-slate-400">
                    <Icons.MessageSquare />
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Last Remark
                  </p>
                  <span className="ml-auto text-[10px] text-slate-400">
                    {formatDate(lastRemark.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "{lastRemark.note}"
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  — {lastRemark.officerName}
                </p>
              </div>
            )}
          </div>

          {/* ── ZONE 2: ACTION WORKBENCH ──────────────────────────────── */}
          {/* LEARNING: Visual separation between read (slate-50) and write (white)
              zones immediately tells the officer: "above = context, below = your job" */}
          <div className="px-5 py-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#1C49BD]" />
              <p className="text-sm font-extrabold text-slate-800">
                Take Action
              </p>
            </div>

            {/* Status selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Update Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                  console.log("key: " , key)

                  return <button
                    key={key}
                    onClick={() => setStatusState(key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200
                      ${
                        statusState === key
                          ? `${cfg.pill} scale-[1.02] shadow-sm`
                          : "border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
                      }`}
                  >
                    <span className={`animate-pulse w-2 h-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                    {statusState === key && (
                      <svg
                        className="w-3 h-3 ml-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                })}
              </div>
            </div>

            {/* Priority selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Update Priority
              </label>
              <div className="flex gap-2">
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setPriorityState(key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-bold transition-all duration-200
                      ${
                        priorityState === key
                          ? `${cfg.cls} scale-[1.02] shadow-sm`
                          : "border-slate-100 text-slate-400 hover:border-slate-200"
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Remark textarea */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Add Remark{" "}
                <span className="text-rose-400 normal-case font-normal">
                  (required)
                </span>
              </label>
              <textarea
                value={noteState}
                onChange={(e) => setNoteState(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Describe the action taken, investigation findings, or response to customer..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C49BD]/30 focus:border-[#1C49BD] resize-none transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1 text-right">
                {noteState.length}/500
              </p>
            </div>
          </div>
        </div>

        {/* ── FOOTER — submit action ────────────────────────────────────── */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-3 flex items-center gap-3">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !noteState.trim()}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-200
              ${
                isSubmitting || !noteState.trim()
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-[#1C49BD] text-white hover:shadow-lg hover:shadow-blue-900/30"
              }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Icons.Send />
                Submit Action
              </>
            )}
          </button>
        </div>
      </aside>

      <style>{`
        @keyframes drawerSlideInMobile {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes drawerSlideInDesktop {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .drawer-slide-in {
          animation: drawerSlideInMobile 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
        @media (min-width: 768px) {
          .drawer-slide-in {
            animation: drawerSlideInDesktop 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
          }
        }
      `}</style>
    </>
  );
}

export default OfficerComplaintsQueue