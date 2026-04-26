// import axios from 'axios'
// import React, { useEffect, useMemo, useState } from 'react'
// import toast from 'react-hot-toast'
// import { 
//   BarChart, 
//   Bar, 
//   XAxis, 
//   YAxis,        
//   Tooltip,      
//   CartesianGrid 
// } from 'recharts'


// const formatDate = (rawDate)=>{
//     if(!rawDate) return "_"
//     return new Date(rawDate).toLocaleDateString('en-PK' , {
//         day : '2-digit' ,
//         month : 'short' ,
//         year : 'numeric'
//     })
// }

// const formatAvgTime = (avgHours)=>{
//     if(avgHours < 1){
//         return `${Math.round(avgHours * 60)} minutes`
//     }
//     if(avgHours < 24){
//         return `${(avgHours).toFixed(1)} hours`
//     }
    
//     return(`${(avgHours/24).toFixed(1)} days`)
// }

// const FILTER_TABS = [
//   { key: "all"  , label: "All" },
//   { key: "pending"  , label: "Pending" },
//   { key: "in_progress"  , label: "In Progress" },
//   { key: "resolved"  , label: "Resolved" },
//   { key: "rejected"  , label: "Rejected" },
// ];


// function NationalComplaintsAnalytics() {

//     const token = localStorage.getItem('userToken')
    
//     const [allComplaints , setAllComplaints] = useState([])
//     const [allOfficers , setAllOfficers] = useState([])
//     const [activeFilter , setActiveFilter] = useState('all')
//     const [hoveredRow , setHoveredRow] = useState(null);
//     const [selectedComplaint, setSelectedComplaint]  = useState(null)
//     const [isLoading, setIsLoading] = useState(true);
//     const [isDrawerOpen , setIsDrawerOpen] = useState(false);

//     useEffect(() => {

//         const fetchData = async () => {
//           try {
//             setIsLoading(true)
//             const [complaintResponse, officerResponse] = await Promise.all([
//               axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/complaint/getAllComplaints`, {
//                 headers: { Authorization: `Bearer ${token}` }
//               }),
//               axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getBankOfficers`, {
//                 headers: { Authorization: `Bearer ${token}` }
//               })
//             ]);
    
//             setAllComplaints(complaintResponse.data.allComplaints);
//             setAllOfficers(officerResponse.data.officers); 

//           }
//           catch (error) {
//             const errorMessage = error.response?.data?.message || 'Data Not Retrieved From Server!'
//             console.error('Data Retrieving Error: ', errorMessage)
//             toast.error('Retrieving Of Complaints OR Officers Failed, Try Later!', {
//               style: {
//                 minWidth: '350px',
//                 maxWidth: '700px',
//               },
//             })
//           }
//           finally{
//             setIsLoading(false)
//           }
//         }
//         fetchData()
    
//       }, [])


//       const stats = useMemo(()=>{

//         const resolvedComplaintsObjs = allComplaints.filter(c => c.status === "resolved");

//         const total = allComplaints.length ;
//         const pending = allComplaints.filter(c => c.status === "pending").length ;
//         const resolved = allComplaints.filter(c => c.status === "resolved").length ;
//         const in_progress = allComplaints.filter(c => c.status === "in_progress").length ;
//         const rejected = allComplaints.filter(c => c.status === "rejected").length ;
//         const fraudComplaints = allComplaints.filter(c => c.category?.toLowerCase().includes("fraud")).length;

//         const resolutionPercent = total > 0 ? +((resolved / total) * 100).toFixed(1) : 0 ;
//         const pendingPercent     = total > 0 ? +((pending / total) * 100).toFixed(1) : 0 ;
//         const inprogressPercent  = total > 0 ? +((in_progress / total) * 100).toFixed(1) : 0;
//         const rejectedPercent    = total > 0 ? +((rejected / total) * 100).toFixed(1) : 0;


//         const lowPriority = allComplaints.filter(c => c.priority === "low").length;
//         const mediumPriority = allComplaints.filter(c => c.priority === 'medium').length
//         const highPriority   = allComplaints.filter(c => c.priority === 'high').length

//         // number of officers = number of banks , no need to calculate banks
//         const totalOfficers = allOfficers.length;

//         const resolutionTime = resolvedComplaintsObjs.length > 0 ?
//         resolvedComplaintsObjs.reduce((sum , c)=>{
//             const hours = (new Date(c.updatedAt) - new Date(c.createdAt)) / (1000 * 60 * 60) ;
//             return sum + hours
//         } , 0) : 0 ;

//         const avgResolutionHours = resolutionTime / resolved ;

//         console.log(formatAvgTime(avgResolutionHours))

//         const statusGraphData = [
//           {status : "resolved" , label : "Resolved" , count : resolved } ,
//           {status : "pending" , label : "Pending" , count : pending } , 
//           {status : "in_progress" , label : "In Progress" , count : in_progress },
//           {status : "rejected" , label : "Rejected" , count : rejected } ,
//         ]

//         const priorityGraphData = [
//           {priority : "high" , label : "High" , count : highPriority } ,
//           {priority : "medium" , label : "Medium" , count : mediumPriority } ,
//           {priority : "low" , label : "Low" , count : lowPriority }
//         ]

//         const complaintCounts = {} ;
//         allComplaints.forEach((c)=>{
//           const bankName = c.bankID?.bankName || "Unknown" ;

//           if(complaintCounts[bankName]){
//             complaintCounts[bankName]++
//           }
//           else{
//             complaintCounts[bankName] = 1
//           }
//         })


//         const complaintsPerBankGraphData =  Object.entries(complaintCounts)
//         .map(([bank , count])=> ({bank , count}))
//         .sort((a , b)=> b.count - a.count) ;



//         return {
//             total ,
//             all : total ,
//             pending ,
//             resolved ,
//             in_progress ,
//             rejected ,
//             fraudComplaints ,
//             resolutionPercent ,
//             pendingPercent ,
//             inprogressPercent ,
//             rejectedPercent ,
//             lowPriority ,
//             mediumPriority ,
//             highPriority ,
//             avgResolutionHours ,
//             statusGraphData ,
//             priorityGraphData ,
//             complaintsPerBankGraphData,
//             // Network Size
//             totalOfficers ,
//             totalBanks: totalOfficers ,
//         }

//       } , [allComplaints , allOfficers])

//       console.log("stats: " , stats)
      
//       const filteredData = useMemo(()=> {
//         return activeFilter === "all"
//         ? allComplaints
//         : allComplaints.filter((c)=> c.status === activeFilter )

//       } , [activeFilter , allComplaints])


//       const drawerOpeningHandler = (complaint)=>{
//         setSelectedComplaint(complaint);
//         setIsDrawerOpen(true)
//       }

//       console.log(allComplaints)

//   return (
//     <>
//       NationalComplaintsAnalytics

      
//       <BarChart data={stats.statusGraphData} width={600} height={300}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="label" />
//         <YAxis />
//         <Tooltip />
//         <Bar dataKey="count" fill="#1C49BD" />
//       </BarChart>



//       {isDrawerOpen && selectedComplaint && (
//         <NationalComplaintDrawer
//           complaint={selectedComplaint}
//           onClose={() => setIsDrawerOpen(false)}
//         />
//       )}
//     </>
//   );
// }

// export default NationalComplaintsAnalytics



// function NationalComplaintDrawer({complaint , onClose}){

//   console.log("Complaint In Drawer: " , complaint)

//   const customerName  = complaint.customerID?.name  || 'Customer'
//   const customerEmail = complaint.customerID?.email || 'abc123@xyz.com'
//   const bankName      = complaint.bankID?.bankName   || 'Unknown Bank'
//   const isFraud       = complaint.category?.toLowerCase().includes('fraud')
//   const isNeverUpdated =
//     new Date(complaint.createdAt).getTime() === new Date(complaint.updatedAt).getTime()



//   return(
//     <div>NationalComplaintDrawer</div>
//   )
// }


// -------------------------------------------------------------------------------------


import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN IDENTITY: "National Command Center"
//
// Visual Language hierarchy across the 3 roles:
//   Customer   → Warm cream (#F9F3EE), soft, inviting
//   Officer    → Slate-900 dark hero, functional authority
//   SBP Admin  → Full dark (#0f172a) + green data-ink + classified-doc drawer
//
// Consistency glue: same #1C49BD brand blue, same Plus Jakarta Sans font,
// same pill/badge system, same drawer slide animation.
// What makes it DIFFERENT: full dark background, green accent data-ink,
// "classified dossier" drawer, ranked leaderboard, recharts in dark panels.
// ─────────────────────────────────────────────────────────────────────────────

// ── SHARED CONFIG ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  pending:     { label: 'Pending',     pill: 'bg-amber-950/60 text-amber-300 border border-amber-800',       dot: 'bg-amber-400',    bar: '#F59E0B', row: 'border-l-amber-500'   },
  in_progress: { label: 'In Progress', pill: 'bg-blue-950/60 text-blue-300 border border-blue-800',           dot: 'bg-blue-400',     bar: '#3B82F6', row: 'border-l-blue-500'    },
  resolved:    { label: 'Resolved',    pill: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800',  dot: 'bg-emerald-400',  bar: '#10B981', row: 'border-l-emerald-500' },
  rejected:    { label: 'Rejected',    pill: 'bg-rose-950/60 text-rose-400 border border-rose-800',           dot: 'bg-rose-500',     bar: '#EF4444', row: 'border-l-rose-500'    },
}

const PRIORITY_CFG = {
  high:   { label: 'High',   color: '#EF4444', cls: 'text-rose-400 border-rose-700 bg-rose-950/50'    },
  medium: { label: 'Medium', color: '#F59E0B', cls: 'text-amber-400 border-amber-700 bg-amber-950/50' },
  low:    { label: 'Low',    color: '#10B981', cls: 'text-emerald-400 border-emerald-700 bg-emerald-950/50' },
}

const FILTER_TABS = [
  { key: 'all',         label: 'All'         },
  { key: 'pending',     label: 'Pending'     },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved',    label: 'Resolved'    },
  { key: 'rejected',    label: 'Rejected'    },
]

// ── HELPERS ───────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}
const formatTime = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true })
}
const formatAvgTime = (h) => {
  if (!h || isNaN(h)) return 'N/A'
  if (h < 1)  return `${Math.round(h * 60)} m`
  if (h < 24) return `${h.toFixed(1)} h`
  return `${(h / 24).toFixed(1)} d`
}

// ── ICONS (inline SVG) ────────────────────────────────────────────────────────
const Ico = {
  Globe: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  TrendUp: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/>
    </svg>
  ),
  Network: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
      <path strokeLinecap="round" d="M12 7v4M9.5 17.5L7 16M14.5 17.5L17 16M12 11l-5 5M12 11l5 5"/>
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
  Shield: () => (
    <svg className="w-4 h-4" fill="none" stroke="blue" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
    </svg>
  ),
  Close: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
    </svg>
  ),
  Paperclip: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
    </svg>
  ),
  FileSearch: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <circle cx="11" cy="15" r="2"/><path strokeLinecap="round" d="M13 17l2 2"/>
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  ),
  Image: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  Lock: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
}

// ── RECHARTS CUSTOM TOOLTIP (dark theme) ─────────────────────────────────────
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-400 font-bold uppercase tracking-widest mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-extrabold" style={{ color: p.color || '#fff' }}>
          {p.value} complaints 
        </p>
      ))}
    </div>
  )
}

// ── LOADING SKELETON ──────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-800 rounded-xl ${className}`} />
)


// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
function NationalComplaintsAnalytics() {

  const token = localStorage.getItem('userToken')

  const [allComplaints,    setAllComplaints]    = useState([])
  const [allOfficers,      setAllOfficers]      = useState([])
  const [activeFilter,     setActiveFilter]     = useState('all')
  const [hoveredRow,       setHoveredRow]       = useState(null)
  const [selectedComplaint,setSelectedComplaint]= useState(null)
  const [isDrawerOpen,     setIsDrawerOpen]     = useState(false)
  const [isLoading,        setIsLoading]        = useState(true)

  // ── Parallel API fetch ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [cRes, oRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/complaint/getAllComplaints`,
            { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getBankOfficers`,
            { headers: { Authorization: `Bearer ${token}` } }),
        ])
        setAllComplaints(cRes.data.allComplaints  ?? [])
        setAllOfficers  (oRes.data.officers       ?? [])
      }
      catch (error) {
        console.error(error.response.message)
        toast.error('Data retrieval failed. Try again.', { style: { minWidth: '350px' } })
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // ── Derived stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total       = allComplaints.length
    const resolved    = allComplaints.filter(c => c.status === 'resolved').length
    const pending     = allComplaints.filter(c => c.status === 'pending').length
    const in_progress = allComplaints.filter(c => c.status === 'in_progress').length
    const rejected    = allComplaints.filter(c => c.status === 'rejected').length
    const fraudComplaints = allComplaints.filter(c => c.category?.toLowerCase().includes('fraud')).length

    const resolutionPercent = total > 0 ? +((resolved / total) * 100).toFixed(1) : 0
    const pendingPercent    = total > 0 ? +((pending / total)  * 100).toFixed(1) : 0
    const inprogressPercent = total > 0 ? +((in_progress / total) * 100).toFixed(1) : 0
    const rejectedPercent   = total > 0 ? +((rejected / total) * 100).toFixed(1) : 0

    const resolvedObjs = allComplaints.filter(c => c.status === 'resolved')
    const totalResolutionHours = resolvedObjs.reduce((sum, c) => {
      return sum + (new Date(c.updatedAt) - new Date(c.createdAt)) / 3_600_000
    }, 0)
    const avgResolutionHours = resolvedObjs.length > 0 ? totalResolutionHours / resolvedObjs.length : 0

    const lowPriority    = allComplaints.filter(c => c.priority === 'low').length
    const mediumPriority = allComplaints.filter(c => c.priority === 'medium').length
    const highPriority   = allComplaints.filter(c => c.priority === 'high').length

    // Graph data
    const statusGraphData = [
      { label: 'Resolved',    count: resolved,    color: '#10B981' },
      { label: 'Pending',     count: pending,     color: '#F59E0B' },
      { label: 'In Progress', count: in_progress, color: '#3B82F6' },
      { label: 'Rejected',    count: rejected,    color: '#EF4444' },
    ]

    const priorityGraphData = [
      { label: 'High',   count: highPriority,   color: '#EF4444' },
      { label: 'Medium', count: mediumPriority,  color: '#F59E0B' },
      { label: 'Low',    count: lowPriority,     color: '#10B981' },
    ]

    // Bank complaint counts for leaderboard
    const bankCounts = {}
    allComplaints.forEach(c => {
      const name = c.bankID?.bankName || 'Unknown'
      bankCounts[name] = (bankCounts[name] || 0) + 1
    })
    const complaintsPerBankGraphData = Object.entries(bankCounts)
      .map(([bank, count]) => ({ bank, count }))
      .sort((a, b) => b.count - a.count)

    return {
      total, all: total, pending, resolved, in_progress, rejected,
      fraudComplaints, resolutionPercent, pendingPercent, inprogressPercent,
      rejectedPercent, lowPriority, mediumPriority, highPriority,
      avgResolutionHours, statusGraphData, priorityGraphData,
      complaintsPerBankGraphData,
      totalOfficers: allOfficers.length,
      totalBanks: allOfficers.length,
    }
  }, [allComplaints, allOfficers])

  // ── Filtered table data ──────────────────────────────────────────────────
  const filteredData = useMemo(() =>
    activeFilter === 'all' ? allComplaints : allComplaints.filter(c => c.status === activeFilter),
    [activeFilter, allComplaints]
  )

  const openDrawer = (c) => { setSelectedComplaint(c); setIsDrawerOpen(true) }
  const closeDrawer = () => { setIsDrawerOpen(false); setSelectedComplaint(null) }

  // ── Tab counts ───────────────────────────────────────────────────────────
  const tabCounts = useMemo(() => ({
    all: stats.total, pending: stats.pending, in_progress: stats.in_progress,
    resolved: stats.resolved, rejected: stats.rejected,
  }), [stats])

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div
      className="w-full min-h-full space-y-6"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >

      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
        {/* Diagonal line texture */}
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg,white,white 1px,transparent 1px,transparent 14px)'
        }}/>
        {/* Brand glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#1C49BD]/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute left-20 bottom-0 w-60 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"/>

        <div className="relative px-6 py-6 md:px-10 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            {/* Classification badge */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Live National Feed</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1C49BD]/15 border border-[#1C49BD]/30 rounded-full">
                <Ico.Shield />
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.15em]">SBP Classified</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
              National Oversight &
              <span className="block bg-gradient-to-r from-[#1C49BD] to-emerald-400 bg-clip-text text-transparent">
                Analytics Command
              </span>
            </h1>
            <p className="mt-2 text-slate-400 text-sm max-w-lg leading-relaxed">
              Complete monitoring of all banking complaints across Pakistan.
              All data is monitored and enforced under the authority of the{' '}
              <span className="text-slate-300 font-semibold">State Bank of Pakistan</span>.
            </p>
          </div>

          {/* Right: SBP emblem block */}
          <div className="shrink-0 flex flex-col items-center gap-1 px-6 py-4 bg-white/[0.05] border border-white/10 rounded-2xl">
            <div className="text-3xl mb-1 text-white font-extrabold [text-shadow:_0_0_30px_rgb(255_255_255),_0_0_40px_rgb(255_255_255)]">🇵🇰</div>
            
            <p className="text-white text-xs font-bold uppercase tracking-widest">State Bank</p>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest">of Pakistan</p>
            <div className="mt-2 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full">
              <span className="text-emerald-400 text-[9px] font-bold uppercase tracking-widest">Authorized Admin</span>
            </div>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════════════
          2. MACRO INDICATORS — 4 authoritative KPI cards
          These are NOT standard cards. Each has a different structural treatment:
          - Data-grid background (dot pattern)
          - Oversized metric number
          - Color-coded left accent bar
          - Contextual sub-metric beneath
      ══════════════════════════════════════════════════════════════════ */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Card 1: Total Complaints */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-5 overflow-hidden group hover:border-[#1C49BD]/50 transition-colors duration-300">
          
            <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage:'radial-gradient(white 1px,transparent 1px)',backgroundSize:'18px 18px'}}/>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1C49BD] to-[#0ea5e9] rounded-l-2xl"/>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">National Total</p>
                <div className="w-8 h-8 rounded-lg bg-[#1C49BD]/15 border border-[#1C49BD]/30 flex items-center justify-center text-[#1C49BD]">
                  <Ico.Globe />
                </div>
              </div>
              <p className="text-5xl font-black text-white leading-none mb-2">{stats.total}</p>
              <p className="text-xs text-slate-400">
                <span className="text-amber-400 font-bold">{stats.pending}</span> awaiting action
              </p>
            </div>
          </div>

          {/* Card 2: Resolution Rate */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-5 overflow-hidden hover:border-emerald-500/40 transition-colors duration-300">
            <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage:'radial-gradient(white 1px,transparent 1px)',backgroundSize:'18px 18px'}}/>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-400 rounded-l-2xl"/>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resolution Rate</p>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <Ico.TrendUp />
                </div>
              </div>
              <div className="flex items-end gap-1 mb-2">
                <p className="text-5xl font-black text-emerald-400 leading-none">{stats.resolutionPercent}</p>
                <p className="text-xl font-bold text-emerald-600 mb-1">%</p>
              </div>
              {/* Mini bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.resolutionPercent}%` }}/>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{stats.resolved} of {stats.total} resolved</p>
            </div>
          </div>

          {/* Card 3: Avg Resolution Time */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-5 overflow-hidden hover:border-amber-500/40 transition-colors duration-300">
            <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage:'radial-gradient(white 1px,transparent 1px)',backgroundSize:'18px 18px'}}/>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-2xl"/>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Avg Resolution</p>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Ico.Clock />
                </div>
              </div>
              <p className="text-4xl font-black text-amber-400 leading-none mb-2 tabular-nums">
                {stats.avgResolutionHours > 30 ? "1 d" : formatAvgTime(stats.avgResolutionHours)}
              </p>
              <p className="text-xs text-slate-400">average per complaint</p>
            </div>
          </div>

          {/* Card 4: Network Size */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-5 overflow-hidden hover:border-violet-500/40 transition-colors duration-300">
            <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage:'radial-gradient(white 1px,transparent 1px)',backgroundSize:'18px 18px'}}/>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-purple-600 rounded-l-2xl"/>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Network Size</p>
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Ico.Network />
                </div>
              </div>
              <p className="text-5xl font-black text-white leading-none mb-2">{stats.totalBanks}</p>
              <p className="text-xs text-slate-400">
                <span className="text-violet-400 font-bold">{stats.totalBanks}</span> banks ·{' '}
                <span className="text-violet-400 font-bold">{stats.totalOfficers}</span> officers
              </p>
            </div>
          </div>
        </div>
      )}


      {/* ═══════════════════════════════════════════════════════════════════
          3. FRAUD ALERT BANNER
          Appears above the analytics section. Red pulsing alert block.
          LEARNING: Structurally separated from graphs so it "demands attention"
          as a standalone element, not buried inside a chart panel.
      ══════════════════════════════════════════════════════════════════ */}
      {!isLoading && stats.fraudComplaints > 0 && (
        <div className="flex items-center gap-4 bg-white shadow-white shadow-2xl border-2 border-rose-800 rounded-2xl px-5 py-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center font-bold text-rose-600 shrink-0 animate-pulse">
            <Ico.AlertTriangle />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-rose-600 text-xs font-black uppercase tracking-widest">⚠ Fraud Alert — Immediate Attention Required</p>
            <p className="text-slate-500 text-sm mt-0.5">
              <span className="text-rose-500 font-extrabold text-base px-0.75">{stats.fraudComplaints}</span>{' '}
              complaint{stats.fraudComplaints !== 1 ? 's' : ''} flagged as fraud-related across the national network.
              Investigate and escalate immediately.
            </p>
          </div>
          <span className="shrink-0 px-3 py-1.5 bg-rose-500/30 border border-rose-500/30 rounded-xl text-rose-700 text-xs font-black uppercase tracking-widest">
            {stats.fraudComplaints} Fraud
          </span>
        </div>
      )}


      {/* ═══════════════════════════════════════════════════════════════════
          4. DEEP ANALYTICS — 3-column grid
          Left 2/3: graphs stacked | Right 1/3: Bank leaderboard
      ══════════════════════════════════════════════════════════════════ */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-72 lg:col-span-1"/>
          <Skeleton className="h-72 lg:col-span-1"/>
          <Skeleton className="h-72 lg:col-span-1"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Graph 1: Status Bar Chart */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Status Breakdown</p>
                <p className="text-sm font-bold text-white mt-0.5">National Distribution</p>
              </div>
              <div className="w-7 h-7 rounded-lg bg-[#1C49BD]/15 border border-[#1C49BD]/30 flex items-center justify-center text-[#1C49BD] text-[10px] font-black tracking-wider">
                BAR
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200} className="">
              <BarChart data={stats.statusGraphData} barSize={28} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={true}/>
                <YAxis tick={{ fill: '#475569', fontSize: 10 , fontWeight: 1000 , stroke: '#475569' , strokeWidth: 0.3 }} axisLine={false} tickLine={false}/>
                <Tooltip content={<DarkTooltip />}/>
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {stats.statusGraphData.map((entry, i) => (
                    <Cell key={i} fill={entry.color}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Graph 2: Priority Pie Chart */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Priority Radar</p>
                <p className="text-sm font-bold text-white mt-0.5">Urgency Distribution</p>
              </div>
              <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-[10px] font-black tracking-wider">
                PIE
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180} className="border-2">
              <PieChart>
                <Pie data={stats.priorityGraphData} dataKey="count" nameKey="label"
                  cx="50%" cy="50%" outerRadius={75} innerRadius={40}
                  paddingAngle={4} stroke="none">
                  {stats.priorityGraphData.map((entry, i) => (
                    <Cell key={i} fill={entry.color}/>
                  ))}
                </Pie>
                <Tooltip content={<DarkTooltip />}/>
                <Legend
                  formatter={(value) => <span className="text-slate-400 text-[10px] font-bold">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Priority mini pills */}
            <div className="flex justify-center gap-2 mt-2">
              {stats.priorityGraphData.map(p => (
                <div key={p.label} className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                  style={{ backgroundColor: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: p.color }}/>
                  <span className="text-[10px] font-bold" style={{ color: p.color }}>{p.label} : {p.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wall of Shame — Bank Leaderboard */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.15em]">⚠ Wall of Accountability</p>
                <p className="text-sm font-bold text-white mt-0.5">Most Complained Banks</p>
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[220px] scrollbar-hide">
              {stats.complaintsPerBankGraphData.length === 0 && (
                <p className="text-slate-600 text-xs text-center py-8">No data yet</p>
              )}
              {stats.complaintsPerBankGraphData.map((item, i) => {
                const maxCount = stats.complaintsPerBankGraphData[0]?.count || 1
                const pct = (item.count / maxCount) * 100
                const rankColor = i === 0 ? 'text-rose-400' : i === 1 ? 'text-amber-400' : i === 2 ? 'text-slate-300' : 'text-slate-600'
                return (
                  <div key={item.bank} className="group">
                    <div className="flex items-center gap-3 mb-1">
                      {/* Rank */}
                      <span className={`text-[11px] font-black w-5 text-center shrink-0 ${rankColor}`}>
                        {i + 1}
                      </span>
                      {/* Bank name */}
                      <p className="text-xs text-slate-300 font-semibold flex-1 truncate">{item.bank}</p>
                      {/* Count */}
                      <span className="text-xs font-black text-white shrink-0">{item.count}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="ml-8 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${i === 0 ? 'bg-rose-500' : i === 1 ? 'bg-amber-500' : i === 2 ? 'bg-slate-400' : 'bg-slate-600'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}


      {/* ═══════════════════════════════════════════════════════════════════
          5. NATIONAL LEDGER — Table
      ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">

        {/* Table header */}
        <div className="px-5 pt-5 pb-0 border-b border-slate-800">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">National Ledger</p>
              <h2 className="text-base font-extrabold text-white mt-0.5">All Complaints Registry</h2>
            </div>
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300">
              {filteredData.length} records
            </span>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {FILTER_TABS.map(tab => {
              const isActive = activeFilter === tab.key
              return (
                <button key={tab.key} onClick={() => setActiveFilter(tab.key)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold tracking-wide/50
                    rounded-t-lg border-b-2 transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? 'border-[#1C49BD] text-[#1C49BD] bg-[#1C49BD]/30'
                      : 'border-transparent text-slate-500 hover:text-slate-400'
                    }`}>
                  {tab.label}
                  <span className={`ml-0.75 px-1.5 py-0.5 rounded-full text-[9px] 
                    ${isActive ? 'bg-[#1C49BD] text-white' : 'bg-slate-800 text-slate-500'}`}>
                    {tabCounts[tab.key] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-10 bg-slate-800 rounded-xl flex-1"/>
                <div className="h-10 bg-slate-800 rounded-xl w-24"/>
                <div className="h-10 bg-slate-800 rounded-xl w-28"/>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-600 mb-3">
              <Ico.FileSearch />
            </div>
            <p className="text-sm font-bold text-slate-500">No records match this filter</p>
            <button onClick={() => setActiveFilter('all')}
              className="mt-3 px-4 py-1.5 text-xs font-bold text-[#1C49BD] bg-[#1C49BD]/10 hover:bg-[#1C49BD]/20 rounded-xl transition-colors">
              View all records
            </button>
          </div>
        )}

        {/* Desktop table */}
        {!isLoading && filteredData.length > 0 && (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800">
                    {['Tracking / Customer', 'Bank', 'Filed / Updated', 'Category', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 ">
                  {filteredData.map(c => {
                    const sCfg = STATUS_CFG[c.status] || STATUS_CFG.pending
                    const isFraud = c.category?.toLowerCase().includes('fraud')
                    return (
                      <tr key={c._id}
                        onMouseEnter={() => setHoveredRow(c._id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={`border-l-4 ${sCfg.row} transition-colors duration-100
                          ${hoveredRow === c._id ? 'bg-slate-900/60' : 'bg-transparent'}`}>

                        {/* Tracking + Customer */}
                        <td className="px-4 py-3.5">
                          <p className="text-[12px] font-black text-[#1C49BD] font-mono">{c.trackingID}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 tracking-wide">{c.customerID?.name || '—'}</p>
                        </td>

                        {/* Bank */}
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-semibold text-slate-300 truncate max-w-[120px]">{c.bankID?.bankName || '—'}</p>
                        </td>

                        {/* Dates */}
                        <td className="px-4 py-3.5">
                          <p className="text-[11px] text-slate-200 font-mono cursor-pointer" title='Complaint Filed On'>{formatDate(c.createdAt)}</p>
                          <p className="italic text-[11px] text-slate-400 mt-0.5 font-mono cursor-pointer" title='Complaint Considerd On'>{formatDate(c.updatedAt)}</p>
                        </td>

                        {/* Category + description */}
                        <td className="px-4 py-3.5 max-w-[160px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-300 truncate">{c.category}</span>
                            {isFraud && <span className="text-rose-500 shrink-0"><Ico.AlertTriangle /></span>}
                            {c.media && <span className="text-slate-500 shrink-0"><Ico.Paperclip /></span>}
                          </div>
                        
                          <p className="text-[10px] text-slate-500 truncate mt-0.5 cursor-pointer" title={c.description}>{c.description}</p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${sCfg.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot} animate-pulse`}/>
                            {sCfg.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3.5">
                          <button onClick={() => openDrawer(c)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-[#1C49BD] border border-slate-700 hover:border-[#1C49BD] text-slate-300 hover:text-white text-[11px] font-bold rounded-xl transition-all duration-200 group">
                            <Ico.FileSearch />
                            Deep Analysis
                            <span className="group-hover:translate-x-0.5 transition-transform"><Ico.ChevronRight /></span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-slate-900">
              {filteredData.map(c => {
                const sCfg = STATUS_CFG[c.status] || STATUS_CFG.pending
                const isFraud = c.category?.toLowerCase().includes('fraud')
                return (
                  <div key={c._id} className={`p-4 border-l-4 ${sCfg.row}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[11px] font-black text-[#1C49BD] font-mono">{c.trackingID}</p>
                        <p className="text-[10px] text-slate-500">{c.customerID?.name} · {c.bankID?.bankName}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sCfg.pill}`}>
                        <span className={`w-1 h-1 rounded-full ${sCfg.dot}`}/>{sCfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-bold text-slate-300">{c.category}</span>
                      {isFraud && <span className="text-rose-500"><Ico.AlertTriangle /></span>}
                    </div>
                    <p className="text-[10px] text-slate-600 truncate mb-3">{c.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-600 font-mono">{formatDate(c.createdAt)}</span>
                      <button onClick={() => openDrawer(c)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold rounded-xl">
                        <Ico.FileSearch /> Analysis
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
              <p className="text-[10px] text-slate-400">{filteredData.length} of {stats.total} records</p>
              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Ico.Lock /> SBP Classified · Authorized Access Only
              </p>
            </div>
          </>
        )}
      </div>

      {/* Drawer */}
      {isDrawerOpen && selectedComplaint && (
        <NationalComplaintDrawer complaint={selectedComplaint} onClose={closeDrawer}/>
      )}
    </div>
  )
}

export default NationalComplaintsAnalytics


// ═════════════════════════════════════════════════════════════════════════════
// DEEP ANALYSIS DRAWER — SBP Official Dossier
// Visual language: classified document, chain-of-custody audit trail,
// dark slate with amber/green/red data-ink.
// ═════════════════════════════════════════════════════════════════════════════
function NationalComplaintDrawer({ complaint, onClose }) {

  const customerName  = complaint.customerID?.name  || 'Unknown'
  const customerEmail = complaint.customerID?.email || '—'
  const bankName      = complaint.bankID?.bankName   || 'Unknown Bank'
  const isFraud       = complaint.category?.toLowerCase().includes('fraud')
  const isNeverUpdated = new Date(complaint.createdAt).getTime() === new Date(complaint.updatedAt).getTime()

  const sCfg = STATUS_CFG[complaint.status]    || STATUS_CFG.pending
  const pCfg = PRIORITY_CFG[complaint.priority] || PRIORITY_CFG.medium

  return (
    <>

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50 h-full" onClick={onClose}/>

      {/* Dossier panel */}
      <aside
        className={`
          fixed z-60 flex flex-col overflow-hidden shadow-2xl
          bottom-0 left-0 right-0 h-[95vh] rounded-t-3xl
          md:top-0 md:bottom-auto md:left-auto md:right-0
          md:h-full md:w-[520px] md:rounded-none md:rounded-l-2xl
          bg-slate-950 border-l border-slate-800
          drawer-slide-in
        `}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >

        {/* ── DOSSIER HEADER ──────────────────────────────────────────── */}
        <div className="shrink-0 bg-slate-900 border-b border-slate-800 px-5 py-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage:'repeating-linear-gradient(45deg,white,white 1px,transparent 1px,transparent 10px)'}}/>
          <div className="absolute right-0 top-0 w-48 h-48 bg-[#1C49BD]/10 rounded-full blur-2xl pointer-events-none"/>

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Classification label */}
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-[#1C49BD]/15 border border-[#1C49BD]/80 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">
                  <Ico.Lock /> SBP Dossier
                </span>
                {isFraud && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/15 border border-rose-500/80 rounded-full text-[9px] font-black text-rose-400 uppercase tracking-[0.2em]">
                    <Ico.AlertTriangle /> Fraud
                  </span>
                )}
              </div>
              <h2 className="text-white font-black text-lg font-mono truncate">{complaint.trackingID}</h2>
              <p className="text-slate-300 text-xs mt-0.5 italic">{bankName}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end gap-1.5 shrink-0 mr-7">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${sCfg.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot} animate-pulse`}/>{sCfg.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black border ${pCfg.cls}`}>
                {pCfg.label} Priority
              </span>
            </div>
          </div>

          <button onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 border border-slate-700 flex items-center justify-center text-slate-400 transition-colors">
            <Ico.Close />
          </button>
        </div>

        {/* ── SCROLLABLE BODY ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-slate-950">
          <div className="p-5 space-y-4">

            {/* Section label helper */}
            {/* LEARNING: A reusable pattern — section labels share the same
                classified-doc aesthetic: uppercase, spaced, with a left rule */}
            {[
              { id: 'subject', label: 'Subject Information' },
              { id: 'evidence', label: 'Evidence & Testimony' },
              { id: 'audit', label: 'Audit Trail — Chain of Custody' },
            ].map(() => null)}

            {/* ── SECTION A: Subject Info ─────────────────────────── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-0.5 h-4 bg-[#1C49BD] rounded-full"/>
                <p className="underline text-[9.5px] font-black text-slate-500 uppercase tracking-[0.25em]">Subject Information</p>
              </div>

              {/* Customer card */}
              <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1C49BD]/20 border border-[#1C49BD]/30 flex items-center justify-center text-[#1C49BD] font-black text-sm shrink-0">
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{customerName}</p>
                  <p className="text-xs text-slate-400 truncate">{customerEmail}</p>
                </div>
                <span className="text-slate-500"><Ico.User /></span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Tracking ID',  value: complaint.trackingID, mono: true         },
                  { label: 'Bank',         value: bankName,             mono: false        },
                  { label: 'Category',     value: complaint.category,   mono: false        },
                  { label: 'Priority',     value: pCfg.label + ' Priority', mono: false   },
                  { label: 'Filed',        value: formatDate(complaint.createdAt), mono: true },
                  { label: 'Last Update',  value: isNeverUpdated ? 'No action yet' : formatDate(complaint.updatedAt), mono: !isNeverUpdated, muted: isNeverUpdated },
                ].map(item => (
                  <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                    <p className={`text-xs font-semibold leading-snug
                      ${item.mono ? 'font-mono text-blue-500' : ''}
                      ${item.muted ? 'text-slate-600 italic' : (!item.mono ? "text-slate-300" : "") }`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION B: Evidence ─────────────────────────────── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-0.5 h-4 bg-amber-500 rounded-full"/>
                <p className="underline text-[9.5px] font-black text-slate-500 uppercase tracking-[0.25em]">Evidence & Testimony</p>
              </div>

              {/* Description */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-3">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Complainant Statement</p>
                <div className="border-l-2 border-amber-500/40 pl-3">
                  <p className="text-xs text-slate-400 leading-relaxed font-medium italic">"{complaint.description}"</p>
                </div>
              </div>

              {/* Media */}
              {complaint.media && typeof complaint.media === 'string' ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                    <span className="text-slate-500"><Ico.Image /></span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Submitted Evidence</span>
                  </div>
                  <img src={complaint.media} alt="Evidence" className=" w-full h-44 object-cover opacity-90"/>
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl px-4 py-6 flex flex-col items-center gap-2">
                  <span className="text-slate-700"><Ico.Image /></span>
                  <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">No Media Submitted</p>
                </div>
              )}
            </div>

            {/* ── SECTION C: Audit Trail ───────────────────────────── */}
            {/* LEARNING: A timeline component built with CSS border-left trick.
                Each node is a circle on the left edge of a vertical line.
                The line is created by border-l on the parent container.
                This is a pure Tailwind pattern — no extra library needed. */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-0.5 h-4 bg-emerald-500 rounded-full"/>
                  <p className="underline text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">Audit Trail — Chain of Custody</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500">
                  {complaint.remarks?.length || 0} entries
                </span>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Complaint filed — always first entry */}
                <div className="flex gap-3 mb-4 border">
                  {/* Timeline spine */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[#1C49BD] border-2 border-slate-950 z-10"/>
                    {(complaint.remarks?.length > 0) && <div className="w-0.5 flex-1 bg-slate-800 mt-1"/>}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black text-[#1C49BD] uppercase tracking-[0.15em]">Complaint Filed</span>
                        <span className="tracking-wide text-[10px] text-slate-400 font-mono">{formatDate(complaint.createdAt)}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Submitted by <span className='font-bold tracking-wide italic text-slate-300 px-1'>{customerName}</span> against <span className='font-bold tracking-wide italic text-slate-300 px-1'>{bankName}</span> </p>
                    </div>
                  </div>
                </div>

                {/* Remarks — each is a timeline node */}
                {complaint.remarks?.length > 0 ? (
                  complaint.remarks.map((remark, i) => {
                    const isLast = i === complaint.remarks.length - 1
                    return (
                      <div key={remark._id || i} className="flex gap-3 mb-4">

                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-3 h-3 rounded-full border-2 border-slate-950 z-10 ${isLast ? 'bg-emerald-500' : 'bg-amber-400'}`}/>
                          {!isLast && <div className="w-0.5 flex-1 bg-slate-800 mt-1"/>}
                        </div>
                        <div className="pb-4 flex-1 min-w-0">
                          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-lg bg-[#1C49BD]/20 flex items-center justify-center text-[#1C49BD] text-[9.5px] font-black shrink-0">
                                  {remark.officerName?.charAt(0)?.toUpperCase() || 'O'}
                                </div>
                                <span className="text-[10px] font-bold text-white">{remark.officerName}</span>
                                {/* Immutable lock badge */}
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-500">
                                  <Ico.Lock /> LOGGED
                                </span>
                              </div>
                              <span className="tracking-wide text-[10px] text-slate-400 font-mono shrink-0">{formatDate(remark.timestamp)}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed italic">"{remark.note}"</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-950 z-10"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl px-3 py-3">
                        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest text-center">
                          No officer action recorded yet
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-4 "/>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-800 bg-slate-900 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Ico.Lock />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">SBP Classified · Read Only</span>
          </div>
          <button onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors">
            Close Dossier
          </button>
        </div>
      </aside>

      <style>{`
        @keyframes drawerSlideInMobile  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes drawerSlideInDesktop { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .drawer-slide-in { animation: drawerSlideInMobile .35s cubic-bezier(.32,.72,0,1) forwards; }
        @media(min-width:768px){
          .drawer-slide-in { animation: drawerSlideInDesktop .35s cubic-bezier(.32,.72,0,1) forwards; }
        }
      `}</style>
    </>
  )
}