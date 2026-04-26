import React, { useState, useMemo, useEffect } from 'react'
import problemImg from "../assets/problem img.png"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'


// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
// Phase 1: Static data. In Phase 2, replace with: const [complaints, setComplaints] = useState([])
// then populate via: axios.get('/getComplaints').then(res => setComplaints(res.data))
// const MOCK_COMPLAINTS = [
//   {
//     _id: '64f1a2b3c4d5e6f7a8b9c0d1',
//     trackingID: 'BV-2024-0091',
//     bankID: 'HBL – Habib Bank Limited',
//     category: 'ATM Card Issue',
//     description: 'My ATM card was blocked without any prior notice and I am unable to withdraw cash.',
//     status: 'pending',
//     media: true,
//     createdAt: '2024-11-03T08:22:00Z',
//   },
//   {
//     _id: '64f1a2b3c4d5e6f7a8b9c0d2',
//     trackingID: 'BV-2024-0087',
//     bankID: 'Meezan Bank',
//     category: 'Unauthorized Transaction',
//     description: 'A transaction of Rs. 15,000 was made from my account that I did not authorize.',
//     status: 'in_progress',
//     media: true,
//     createdAt: '2024-10-28T14:05:00Z',
//   },
//   {
//     _id: '64f1a2b3c4d5e6f7a8b9c0d3',
//     trackingID: 'BV-2024-0074',
//     bankID: 'MCB – Muslim Commercial Bank',
//     category: 'Account Related',
//     description: 'My savings account has been frozen without any explanation from the bank.',
//     status: 'resolved',
//     media: false,
//     createdAt: '2024-10-15T09:40:00Z',
//   },
//   {
//     _id: '64f1a2b3c4d5e6f7a8b9c0d4',
//     trackingID: 'BV-2024-0068',
//     bankID: 'Bank Alfalah',
//     category: 'Loan / Finance',
//     description: 'Extra charges have been applied to my loan installment without explanation.',
//     status: 'resolved',
//     media: false,
//     createdAt: '2024-10-09T11:15:00Z',
//   },
//   {
//     _id: '64f1a2b3c4d5e6f7a8b9c0d5',
//     trackingID: 'BV-2024-0055',
//     bankID: 'UBL – United Bank Limited',
//     category: 'Online Banking',
//     description: 'Internet banking portal shows incorrect balance and recent transactions are missing.',
//     status: 'pending',
//     media: false,
//     createdAt: '2024-09-30T16:52:00Z',
//   },
//   {
//     _id: '64f1a2b3c4d5e6f7a8b9c0d6',
//     trackingID: 'BV-2024-0049',
//     bankID: 'Faysal Bank',
//     category: 'Fraud Report',
//     description: 'I received a fraudulent call claiming to be from the bank and my OTP was misused.',
//     status: 'in_progress',
//     media: true,
//     createdAt: '2024-09-21T10:30:00Z',
//   },
//   {
//     _id: '64f1a2b3c4d5e6f7a8b9c0d7',
//     trackingID: 'BV-2024-0038',
//     bankID: 'ABL – Allied Bank Limited',
//     category: 'Cheque Related',
//     description: 'My cheque was returned without valid reason even though sufficient funds were available.',
//     status: 'resolved',
//     media: false,
//     createdAt: '2024-09-10T13:20:00Z',
//   },
// ]

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    pill: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-400',
    card: 'from-amber-500 to-orange-400',
    cardBg: 'bg-amber-50',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
      </svg>
    ),
  },
  in_progress: {
    label: 'In Progress',
    pill: 'bg-blue-50 text-[#1C49BD] border border-blue-200',
    dot: 'bg-blue-500',
    card: 'from-[#1C49BD] to-[#0ea5e9]',
    cardBg: 'bg-blue-50',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  resolved: {
    label: 'Resolved',
    pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    card: 'from-emerald-500 to-teal-400',
    cardBg: 'bg-emerald-50',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  rejected: {
    label: 'Rejected',
    pill: 'bg-rose-50 text-rose-600 border border-rose-200',
    dot: 'bg-rose-500',
    card: 'from-rose-500 to-pink-500',
    cardBg: 'bg-rose-50',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  },
}

// ─── FILTER TABS ───────────────────────────────────────────────────────────────
const FILTER_TABS = [
  { key: 'all',         label: 'All' },
  { key: 'pending',     label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved',    label: 'Resolved' },
  { key: 'rejected',    label: 'Rejected' },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-PK', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── ILLUSTRATIONS (inline SVG) ───────────────────────────────────────────────
const PortalIllustration = () => (
  <svg viewBox="0 0 260 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Shield body */}
    <path d="M130 18L92 34V70C92 92 108 112 130 120C152 112 168 92 168 70V34L130 18Z" fill="#1C49BD" opacity="0.12" />
    <path d="M130 24L97 38V70C97 89 111 107 130 115C149 107 163 89 163 70V38L130 24Z" fill="#1C49BD" opacity="0.2" stroke="#1C49BD" strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Checkmark */}
    <path d="M115 70l10 10 20-20" stroke="#1C49BD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Document left */}
    {/* <rect x="44" y="52" width="36" height="48" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
    <rect x="50" y="62" width="24" height="2.5" rx="1.25" fill="#cbd5e1"/>
    <rect x="50" y="69" width="18" height="2.5" rx="1.25" fill="#e2e8f0"/>
    <rect x="50" y="76" width="21" height="2.5" rx="1.25" fill="#e2e8f0"/>
    <rect x="50" y="83" width="15" height="2.5" rx="1.25" fill="#f1f5f9"/> */}
    {/* Document right */}
    {/* <rect x="180" y="52" width="36" height="48" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
    <rect x="186" y="62" width="24" height="2.5" rx="1.25" fill="#cbd5e1"/>
    <rect x="186" y="69" width="18" height="2.5" rx="1.25" fill="#e2e8f0"/>
    <rect x="186" y="76" width="21" height="2.5" rx="1.25" fill="#e2e8f0"/>
    <circle cx="198" cy="90" r="5" fill="#1C49BD" opacity="0.2"/>
    <path d="M196 90l1.5 1.5 3-3" stroke="#1C49BD" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/> */}
    {/* Connector lines */}
    <path d="M80 76 Q100 76 92 70" stroke="#1C49BD" strokeWidth="1" strokeDasharray="3 2" opacity="0.4"/>
    <path d="M180 76 Q160 76 168 70" stroke="#1C49BD" strokeWidth="1" strokeDasharray="3 2" opacity="0.4"/>
    {/* Bottom text line decoration */}
    <rect x="90" y="132" width="80" height="3" rx="1.5" fill="#1C49BD" opacity="0.15"/>
    <rect x="108" y="139" width="44" height="2.5" rx="1.25" fill="#1C49BD" opacity="0.08"/>
  </svg>
)

const EmptyIllustration = () => (
  <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full ">
    {/* Box outline */}
    <rect x="60" y="68" width="100" height="76" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
    {/* Box flaps */}
    <path d="M60 92h100" stroke="#e2e8f0" strokeWidth="1.5"/>
    <path d="M95 68v24M125 68v24" stroke="#e2e8f0" strokeWidth="1.5"/>
    <path d="M95 68c0-8 10-12 15-6 5-6 15-2 15 6" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5"/>
    {/* Magnifying glass */}
    <circle cx="148" cy="108" r="18" fill="white" stroke="#cbd5e1" strokeWidth="2"/>
    <circle cx="148" cy="108" r="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5"/>
    <line x1="158" y1="120" x2="168" y2="130" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"/>
    {/* Question mark inside glass */}
    <text x="145" y="113" fontSize="10" fill="#94a3b8" fontWeight="bold">?</text>
    {/* Dots scattered */}
    <circle cx="72" cy="55" r="3" fill="#e2e8f0"/>
    <circle cx="150" cy="48" r="2" fill="#e2e8f0"/>
    <circle cx="168" cy="62" r="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1"/>
    <circle cx="55" cy="110" r="2.5" fill="#e2e8f0"/>
  </svg>
)

// ─── PAPERCLIP ICON ───────────────────────────────────────────────────────────
const PaperclipIcon = () => (
  <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
)

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
function CustomerPortal() {
  // Phase 2: replace MOCK_COMPLAINTS with [] and populate from API
  // const [complaints] = useState(MOCK_COMPLAINTS)
  const [complaints , setComplaints] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [hoveredRow, setHoveredRow] = useState(null)
  const [selectedComplaint , setSelectedComplaint] = useState(null) ;
  const [isDrawerOpen , setIsDrawerOpen] = useState(false);
  const navigate = useNavigate()

  const token = localStorage.getItem("userToken");
  console.log("token from customer portal: " , token)

  useEffect(()=>{
    const gettingDBData = async ()=>{
      try {
         const responseForComplaints = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/complaint/getComplaints` ,
            {
              headers : {
                Authorization : `Bearer ${token}`
              }
            }
         );

         console.log("Data From Backend: " , responseForComplaints.data);
         console.log("Message From Backend: " , responseForComplaints.data.message);
         toast.success(responseForComplaints.data.message , {
            style: {
              minWidth: "350px",
              maxWidth: "700px",
            },
        });

        setComplaints(responseForComplaints.data.complaintsForFrontend)
        console.log("Complaints in hand: " , responseForComplaints.data.complaintsForFrontend);

      }
      catch (error) {
        const errorMessage = error.response?.data?.message || "Retrieving Of Complaints Failed!" ;
        console.error("Retrieving Of Complaints Failed!", errorMessage);
        toast.error("Retrieving Of Complaints Failed! , Try Later!", {
            style: {
              minWidth: "350px",
              maxWidth: "700px",
            },
        });
      }
    }

    gettingDBData()
  } , [])


  // ── Derived stats (dynamically calculated from data) ──────────────────────
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "pending").length;
    const resolved = complaints.filter((c) => c.status === "resolved").length;
    const in_progress = complaints.filter((c)=> c.status === "in_progress").length;
    const rejected = total - (pending + resolved + in_progress);

    return {
      all: total,
      total,
      pending,
      resolved,
      in_progress,
      rejected, // ✓ Calculated value, not function
    };
  }, [complaints]);

  console.log("stats: " , stats);
  console.log("rejected stat: " , stats.rejected);

  // ── Filtered data ─────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    activeFilter === 'all' ? complaints : complaints.filter(c => c.status === activeFilter),
    [complaints, activeFilter]
  )

  const STAT_CARDS = [
    {
      label: "Total Filed",
      value: stats.total,
      gradient: "from-[#1C3C97] to-[#1C49BD]",
      iconBg: "bg-white/15",
      textColor: "text-white",
      subColor: "text-blue-200",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      label: "Pending",
      value: stats.pending,
      gradient: "from-amber-300/95 to-orange-400",
      iconBg: "bg-white/20",
      textColor: "text-white",
      subColor: "text-amber-100",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      label: "In Progress",
      value: stats.in_progress,
      gradient: "from-sky-500 to-cyan-400",
      iconBg: "bg-white/20",
      textColor: "text-white",
      subColor: "text-sky-100",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
    {
      label: "Resolved",
      value: stats.resolved,
      gradient: "from-emerald-500 to-teal-400",
      iconBg: "bg-white/20",
      textColor: "text-white",
      subColor: "text-emerald-100",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Rejected",
      value: stats.rejected,
      gradient: "from-red-800 to-rose-500",
      iconBg: "bg-white/20",
      textColor: "text-white",
      subColor: "text-emerald-100",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 16l4-4m0 0l4-4m-4 4l-4-4m4 4l4 4m5-4a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 font-jakarta" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* bg-gradient-to-br from-[#1C3C97] via-[#1C49BD] to-[#0284c7] */}
      {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9] px-6 py-6 md:px-8 md:py-7">
        {/* bg dots */}
        <div className="absolute inset-0 opacity-[0.2]" style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '22px 22px'
        }} />
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -right-4 bottom-0 w-32 h-32 bg-black/10 rounded-full pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sky-200 text-[11px] font-semibold tracking-wider uppercase">Secure Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              My Complaints
            </h1>
            <p className="mt-1 text-blue-200 text-sm max-w-md">
              Track, manage, and monitor all your banking complaints in one place. Backed by SBP oversight.
            </p>
          </div>
          {/* Illustration */}
          <div className="w-32 h-20 sm:w-40 sm:h-24 shrink-0 opacity-90">
            <PortalIllustration />
          </div>
        </div>
      </div>

      {/* ── STAT CARDS GRID ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className={`relative rounded-2xl bg-gradient-to-br ${card.gradient} p-5 overflow-hidden shadow-lg shadow-black/5 hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="flex items-start justify-between">
              <div className=''>
                <p className={`text-xs font-semibold uppercase tracking-widest ${card.subColor} mb-2`}>
                  {card.label}
                </p>
                <p className={`text-4xl font-extrabold ${card.textColor}`}>{card.value}</p>
              </div>
              <div className={`w-10 h-10 lg:w-8 lg:h-8 lg:ml-1 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABLE SECTION ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Table Header + Filter Tabs */}
        <div className="px-5 pt-5 pb-0 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Complaint History</h2>
              <p className="text-xs text-slate-400 mt-0.5">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</p>
            </div>
            {/* Post New button */}
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C49BD] text-white text-xs font-semibold rounded-xl hover:bg-[#1C3C97] transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/50 shrink-0" onClick={()=>(navigate("/customer/postcomplaint"))} >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Complaint
            </button>
          </div>

          {/* Filter tabs — scrollable on mobile */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.key
            //   const count = tab.key === 'all' ? complaints.length : complaints.filter(c => c.status === tab.key).length
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? 'border-[#1C49BD] text-[#1C49BD] bg-blue-100/70'
                      : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
                    ${isActive ? 'bg-[#1C49BD] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {stats[tab.key]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── EMPTY STATE ──────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-44 h-36 mb-4 opacity-100">
              <EmptyIllustration />
            </div>
            <h3 className="text-base font-bold text-slate-700 mt-2">No complaints found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">
              There are no complaints matching this filter. Try switching to a different status or file a new complaint.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-5 px-4 py-2 text-xs font-semibold text-[#1C49BD] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"
            >
              View all complaints
            </button>
          </div>
        ) : (
          <>
            {/* ── DESKTOP TABLE ───────────────────────────────────────────── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/60">
                    {['Tracking ID / Bank', 'Date Filed', 'Category', 'Status', ''].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11.5px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((c) => {
                    const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending
                    return (
                      <tr
                        key={c._id}
                        onMouseEnter={() => setHoveredRow(c._id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={` transition-colors duration-150 ${hoveredRow === c._id ? 'bg-slate-200/75' : 'bg-white'}`}
                      >
                        {/* Tracking ID + Bank */}
                        <td className="px-5 py-4">
                          <p className="text-xs font-bold text-[#1C49BD] font-mono tracking-wide">{c.trackingID}</p>
                          <p className="underline text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">{c.bankID.bankName}</p>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-xs font-medium text-slate-600">{formatDate(c.createdAt)}</p>
                        </td>

                        {/* Category + paperclip */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">{c.category}</span>
                            {c.media && <PaperclipIcon />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[180px]">{c.description}</p>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                            {cfg.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4">
                          <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#1C49BD] hover:text-[#1C3C97] transition-colors duration-150 group"
                          onClick={()=>{
                            setSelectedComplaint(c) ;
                            setIsDrawerOpen(true) ;
                          }}
                          >
                            View
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE CARDS ────────────────────────────────────────────── */}
            <div className="md:hidden divide-y divide-slate-300">
              {filtered.map((c) => {
                const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending
                return (
                  <div key={c._id} className="p-4 hover:bg-slate-50/60 transition-colors duration-150">
                    {/* Row 1: tracking ID + status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs font-bold text-[#1C49BD] font-mono">{c.trackingID}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[180px]">{c.bankID.bankName}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${cfg.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    {/* Row 2: category + media */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-semibold text-slate-700">{c.category}</span>
                      {c.media && <PaperclipIcon />}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mb-2">{c.description}</p>
                    {/* Row 3: date + action */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{formatDate(c.createdAt)}</span>
                      <button className="flex items-center gap-1 text-xs font-semibold text-[#1C49BD]"
                      onClick={()=>{
                            setSelectedComplaint(c) ;
                            setIsDrawerOpen(true) ;
                      }}>
                        View Details
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Table Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">Showing {filtered.length} of {complaints.length} complaints</p>
            <p className="text-[11px] text-slate-300 font-medium">Monitored by SBP 🇵🇰</p>
          </div>
        )}

        {isDrawerOpen &&
        <ComplaintDrawer complaint={selectedComplaint} onClose={()=> setIsDrawerOpen(false) } />
        }


      </div>
    </div>
  )
}

export default CustomerPortal



const ComplaintDrawer = ({ complaint, onClose }) => {


  console.log("complaint: ", complaint);

  // ── LEARNING 1: Never use negative indexing in JavaScript ──────────────────
  // Your original code: singleComplaint.remarks[-1]  ← always returns undefined
  // JavaScript arrays don't support Python-style negative indexing.
  // Correct way to get the last element: array[array.length - 1]
  const lastRemark = complaint.remarks?.length > 0
    ? complaint.remarks[complaint.remarks.length - 1]
    : null


  // ── LEARNING 2: Optional chaining (?.) ────────────────────────────────────
  // complaint.bankID?.bankName safely returns undefined instead of crashing
  // if bankID is null/undefined (can happen with bad API responses)
  const bankName = complaint.bankID?.bankName || 'Unknown Bank'

  // ── Status config lookup ───────────────────────────────────────────────────
  const statusCfg = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.pending

  // ── LEARNING 3: Date comparison fix ───────────────────────────────────────
  // Your original: createdAt == updatedAt  ← compares string references, unreliable
  // Better: compare numeric timestamps
  const isNeverUpdated =
    new Date(complaint.createdAt).getTime() === new Date(complaint.updatedAt).getTime()

  // ── Priority badge config ──────────────────────────────────────────────────
  const PRIORITY_CONFIG = {
    high:   { label: 'High Priority',   cls: 'bg-rose-50 text-rose-600 border border-rose-200' },
    medium: { label: 'Medium Priority', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
    low:    { label: 'Low Priority',    cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  }
  const priorityCfg = PRIORITY_CONFIG[complaint.priority] || PRIORITY_CONFIG.medium

  return (
    // ── LEARNING 4: Backdrop + Drawer are siblings, not nested ───────────────
    // Your original had the drawer INSIDE the backdrop div.
    // Problem: clicks on the drawer bubble up to the backdrop and close it.
    // Fix: use a fragment (<>) with both as siblings.
    // The backdrop covers the whole screen. The drawer sits on top independently.
    <>
      {/* ── BACKDROP ── click it to close ──────────────────────────────────── */}
      {/* LEARNING 5: onClick on backdrop, but NOT on drawer panel (stopPropagation not needed this way) */}
      <div
        className="fixed inset-0  bg-black/25 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* ── DRAWER PANEL ───────────────────────────────────────────────────── */}
      {/* LEARNING 6: The slide-in animation
          Your original always had translate-x-0 — meaning it was always "open".
          Since we only render this component when isDrawerOpen is true,
          we use a CSS entrance animation instead via @keyframes in a style tag.
          On desktop: slides in from right (translateX)
          On mobile:  full width, slides up from bottom (translateY) */}
      <aside
        className={`
          fixed z-50 bg-white shadow-2xl overflow-hidden
          flex flex-col
          bottom-0 left-0 right-0 h-[92vh] rounded-t-3xl
          md:top-0 md:bottom-auto md:left-auto md:right-0 md:h-full md:w-[500px] md:rounded-none md:rounded-l-3xl
          drawer-slide-in
        `}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* ── HEADER STRIP ─────────────────────────────────────────────────── */}
        {/* LEARNING 7: sticky top-0 keeps the header visible while body scrolls */}
        <div className="shrink-0 bg-gradient-to-r from-[#1C3C97] to-[#1C49BD] px-5 py-4 relative overflow-hidden">
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(white 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Tracking ID */}
              <p className="text-sky-300 text-[10px] font-bold uppercase tracking-widest mb-1">
                Complaint Detail
              </p>
              <h2 className="text-white font-extrabold text-lg leading-tight font-mono truncate">
                {complaint.trackingID}
              </h2>
              <p className="text-blue-200 text-xs mt-1 truncate">{bankName}</p>
            </div>

            {/* Status + Priority badges */}
            <div className="pr-7 flex flex-col items-end gap-1.5 shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-white border border-white/20`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`}
                />
                {statusCfg.label}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${priorityCfg.cls}`}
              >
                {priorityCfg.label}
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ── SCROLLABLE BODY ───────────────────────────────────────────────── */}
        {/* LEARNING 8: overflow-y-auto here (not on the whole aside)
            so only the content scrolls, header stays fixed */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#F9F3EE]">
          <div className="p-5 space-y-4">
            {/* ── 1. MEDIA IMAGE ─────────────────────────────────────────────── */}
            {/* LEARNING 9: Always guard media with a conditional.
                If media is a boolean true (mock data), don't render an img tag.
                Only render when it's an actual URL string. */}
            {complaint.media && typeof complaint.media === "string" ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="bg-white px-4 pt-3 pb-1 flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Attached Evidence
                  </span>
                </div>
                <img
                  src={complaint.media}
                  alt="Complaint evidence"
                  className="w-full h-48 object-cover"
                />
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="bg-white px-4 pt-3 pb-1 flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Attached Evidence
                  </span>
                </div>
                <img
                  src={problemImg}
                  alt="Complaint evidence"
                  className="w-full h-48 object-cover opacity-40"
                />
              </div>
            )}

            {/* ── 2. KEY DETAILS GRID ────────────────────────────────────────── */}
            {/* LEARNING 10: Use a grid instead of paired fixed-width divs.
                Your w-[230px] pairs broke on small screens.
                grid-cols-2 adapts naturally to any width. */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-50">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Complaint Info
                </p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-slate-200">
                {[
                  {
                    label: "Tracking ID",
                    value: complaint.trackingID,
                    mono: true,
                  },
                  { label: "Bank", 
                    value: bankName, 
                    mono: false 
                  },
                  { label: "Category",
                    value: complaint.category, 
                    mono: false 
                  },
                  {
                    label: "Status",
                    value: statusCfg.label,
                    mono: false,
                    badge: true,
                  },
                  {
                    label: "Filed On",
                    value: formatDate(complaint.createdAt),
                    mono: true,
                  },
                  {
                    label: "Last Updated",
                    value: isNeverUpdated
                      ? "Not updated yet"
                      : formatDate(complaint.updatedAt),
                    mono: !isNeverUpdated,
                    muted: isNeverUpdated,
                  },
                ].map((item) => (
                  <div key={item.label} className="px-4 py-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    {item.badge ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${statusCfg.pill}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                        />
                        {item.value}
                      </span>
                    ) : (
                      <p
                        className={`text-sm font-semibold leading-snug
                        ${item.mono ? "font-mono text-[#1C49BD]" : ""}
                        ${item.muted ? "text-slate-400 italic text-xs" : 
                          (!item.mono ? "text-slate-700" : "")}
                        ${item.label == "Category" ? "italic" : ""}
                      `}
                      >
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── 3. DESCRIPTION ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Description
              </p>
              {/* Left blue accent border — professional document feel */}
              <div className="border-l-4 border-[#1C49BD]/30 pl-3">
                <p className="text-sm text-slate-700 leading-relaxed font-medium break-words">
                  {complaint.description}
                </p>
              </div>
            </div>

            {/* ── 4. OFFICER REMARKS ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Officer Remarks
                </p>
                {/* Remarks count badge */}
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">
                  {complaint.remarks?.length || 0} remark
                  {complaint.remarks?.length !== 1 ? "s" : ""}
                </span>
              </div>

              {lastRemark ? (
                // ── Has remarks ──────────────────────────────────────────────
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Officer avatar initials */}
                    <div className="w-9 h-9 rounded-full bg-[#1C49BD] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                      {lastRemark.officerName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "OF"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {lastRemark.officerName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatDate(lastRemark.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {lastRemark.note}
                    </p>
                  </div>
                  {/* Show count if more than one */}
                  {complaint.remarks.length > 1 && (
                    <p className="text-xs text-slate-400 text-center">
                      + {complaint.remarks.length - 1} earlier remark
                      {complaint.remarks.length - 1 !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              ) : (
                // ── No remarks yet ────────────────────────────────────────────
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <svg
                      className="w-5 h-5 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    No remarks yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                    The bank officer hasn't responded to this complaint yet.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom padding for mobile safe area */}
            <div className="h-4" />
          </div>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-3 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-medium">
            Monitored by SBP 🇵🇰
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </aside>

      {/* ── Slide-in animation ────────────────────────────────────────────── */}
      {/* LEARNING 11: CSS keyframes injected via style tag.
          On mobile: slides up from bottom (translateY 100% → 0)
          On desktop: slides in from right (translateX 100% → 0)
          Both use the same class — media query inside the keyframe handles both. */}
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