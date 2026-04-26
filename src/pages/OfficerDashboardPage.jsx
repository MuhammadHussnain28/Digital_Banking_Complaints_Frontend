import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// VISUAL IDENTITY NOTE:
// Customer Portal → light cream (#F9F3EE), soft, user-facing, form-like
// Officer Dashboard → dark slate command center feel, analytical, authoritative
// Same blue brand color (#1C49BD) but completely different spatial composition
// This page uses a DARK HERO + light body — creates immediate visual distinction
// ─────────────────────────────────────────────────────────────────────────────

// ── Inline SVG Icons (self-contained, no import needed) ──────────────────────
const Icon = {
  Shield: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Building: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="9" width="18" height="12" rx="1" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-6 9 6" />
      <line x1="9" y1="22" x2="9" y2="14" /><line x1="15" y1="22" x2="15" y2="14" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Zap: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
}

// ── Stat card config — each card has its own visual identity ─────────────────
// LEARNING: Extracting config to an array instead of hardcoding JSX repeatedly.
// This is the "data-driven UI" pattern — define WHAT to show as data,
// then .map() renders it. Adding a new card = just add one object.
const buildStatCards = (stats) => [
  { 
    label: 'Total Assigned',
    value: stats.total,
    icon: <Icon.FileText />,
    gradient: 'from-slate-600 to-slate-900',
    iconBg: 'bg-white/10',
    accent: 'text-white',
    sub: 'text-slate-300',
    ring: 'ring-slate-600',
  },
  {
    label: 'Pending',
    value: stats.pending,
    icon: <Icon.Clock />,
    gradient: 'from-amber-400 to-orange-500',
    iconBg: 'bg-white/20',
    accent: 'text-white',
    sub: 'text-amber-100',
    ring: 'ring-amber-400',
  },
  {
    label: 'In Progress',
    value: stats.in_progress,
    icon: <Icon.Refresh />,
    gradient: 'from-[#1C49BD] to-[#0284c7]',
    iconBg: 'bg-white/15',
    accent: 'text-white',
    sub: 'text-blue-200',
    ring: 'ring-blue-400',
  },
  {
    label: 'Resolved',
    value: stats.resolved,
    icon: <Icon.Check />,
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-white/20',
    accent: 'text-white',
    sub: 'text-emerald-100',
    ring: 'ring-emerald-400',
  },
  {
    label: 'Rejected',
    value: stats.rejected,
    icon: <Icon.X />,
    // gradient: 'from-rose-500 to-pink-600',
    gradient: 'from-red-800 to-rose-500',
    iconBg: 'bg-white/20',
    accent: 'text-white',
    sub: 'text-rose-100',
    ring: 'ring-rose-400',
  },
  {
    label: 'Fraud Related',
    value: stats.fraudComplaints,
    icon: <Icon.AlertTriangle />,
    gradient: 'from-violet-600 to-purple-700',
    iconBg: 'bg-white/15',
    accent: 'text-white',
    sub: 'text-violet-200',
    ring: 'ring-violet-400',
  },
]

// ── Priority pill config ──────────────────────────────────────────────────────
const PRIORITY_STYLE = {
  high:   { label: 'High',   bg: 'bg-rose-500',    track: 'bg-rose-100'   },
  medium: { label: 'Medium', bg: 'bg-amber-400',   track: 'bg-amber-100'  },
  low:    { label: 'Low',    bg: 'bg-emerald-500', track: 'bg-emerald-100' },
}

// ── Status pill config for the "distribution" section ────────────────────────
const STATUS_DIST = [
  { key: 'pendingPercent',     label: 'Pending',     color: 'bg-amber-400'   },
  { key: 'inprogressPercent',  label: 'In Progress', color: 'bg-[#1C49BD]'   },
  { key: 'resolutionPercent',  label: 'Resolved',    color: 'bg-emerald-500' },
  { key: 'rejectedPercent',    label: 'Rejected',    color: 'bg-rose-500'    },
]


function OfficerDashboardPage() {

  const navigate = useNavigate()
  const token = localStorage.getItem("userToken")
  const { reduxUser } = useSelector((state) => state.auth)

  const [officerComplaints, setOfficerComplaints] = useState([])

  // LEARNING: useState with an initializer function (() => expression)
  // The function runs ONCE on mount, not on every render.
  // Perfect for values that are computed once and never change (like fake experience).
  const [officerExperience] = useState(() => Math.floor(Math.random() * 5) + 1)

  // ── Derive initials from officer name ────────────────────────────────────
  // LEARNING: optional chaining (?.) prevents crash if reduxUser is null
  const officerName = reduxUser?.name || 'Officer'
  const bankName    = reduxUser?.bank_id?.bankName || 'Your Bank'
  const initials    = officerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // ── API call ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/complaint/bankComplaints`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        toast.success(res.data.message, { style: { minWidth: '350px', maxWidth: '700px' } })
        console.log("Data Recieved For Officer Dashboard: " , res.data?.bankComplaints)
        setOfficerComplaints(res.data?.bankComplaints ?? [])
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to load complaints'
        console.log("Failed To Fetch Officer Specific Compalints: " , msg)
        toast.error(msg, { style: { minWidth: '350px', maxWidth: '700px' } })
      }
    }
    fetchComplaints()
  }, [])


  const stats = useMemo(() => {
    const total       = officerComplaints.length
    const pending     = officerComplaints.filter(c => c.status === 'pending').length
    const resolved    = officerComplaints.filter(c => c.status === 'resolved').length
    const in_progress = officerComplaints.filter(c => c.status === 'in_progress').length
    const rejected    = officerComplaints.filter(c => c.status === 'rejected').length
    const fraudComplaints = officerComplaints.filter(c =>
      c.category?.toLowerCase().includes('fraud')).length

    // LEARNING: Your original rejected = total - (pending + resolved + in_progress)
    // This is fragile — if a new status is added later, rejected gets wrong number.
    // Better to filter directly by status === 'rejected' for accuracy.

    const lowPriority    = officerComplaints.filter(c => c.priority === 'low').length
    const mediumPriority = officerComplaints.filter(c => c.priority === 'medium').length
    const highPriority   = officerComplaints.filter(c => c.priority === 'high').length

    // LEARNING: toFixed(1) gives one decimal place → "87.5%"
    // Always guard with "total > 0" to avoid dividing by zero (NaN or Infinity)
    const resolutionPercent  = total > 0 ? +((resolved    / total) * 100).toFixed(1) : 0
    const pendingPercent     = total > 0 ? +((pending     / total) * 100).toFixed(1) : 0
    const inprogressPercent  = total > 0 ? +((in_progress / total) * 100).toFixed(1) : 0
    const rejectedPercent    = total > 0 ? +((rejected    / total) * 100).toFixed(1) : 0

    return {
      total, pending, resolved, in_progress, rejected, fraudComplaints,
      resolutionPercent, pendingPercent, inprogressPercent, rejectedPercent,
      lowPriority, mediumPriority, highPriority,
    }
  }, [officerComplaints])
  console.log("stats: " , stats)

  const statCards = buildStatCards(stats)
  console.log("statCards: " , statCards)

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full space-y-6 font-jakarta"
      // style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — PROFILE HERO CARD
          Visual identity: DARK background (slate-900) — this is the main
          differentiator from the customer portal's light cream feel.
          Gives an "authority / command center" atmosphere.
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative rounded-2xl bg-slate-900 overflow-hidden">

        {/* Background texture — subtle diagonal lines pattern */}
        {/* LEARNING: Inline style for backgroundImage because Tailwind can't
            generate arbitrary SVG data URIs at build time */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            white,
            white 1px,
            transparent 1px,
            transparent 12px
          )`
        }} />

        {/* Glow blob — gives depth to the dark card */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1C49BD]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

            {/* Left: Avatar + Identity */}
            <div className="flex items-center gap-5">
              {/* Avatar with ring */}
              {/* LEARNING: ring-2 ring-offset-2 ring-offset-slate-900 creates
                  the "floating ring" effect — a gap between avatar and the ring */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1C49BD] to-[#0ea5e9] flex items-center justify-center text-white text-2xl font-extrabold shadow-xl ring-2 ring-[#1C49BD]/40 ring-offset-4 ring-offset-slate-900">
                  {initials}
                </div>
                {/* Online pulse dot */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </span>
              </div>

              {/* Name + Role + Bank */}
              <div >
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    {officerName}
                  </h1>
                  {/* Verified badge */}
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#1C49BD]/30 border border-[#1C49BD]/50 rounded-full text-[10px] font-bold text-sky-300 uppercase tracking-wide">
                    <Icon.Shield /> Verified
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm underline mb-2">
                  <span className="text-slate-300"><Icon.Building /></span>
                  <span className="font-semibold text-slate-300 italic">{bankName}</span>
                </div>
                {/* Active status */}
                <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-[9.5px] font-bold uppercase tracking-wide">
                    Active & On Duty
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Stats + Experience — pushed to right on desktop */}
            <div className=" flex flex-wrap gap-3  border-white">

      
              <div className="px-1.5 py-1.5 lg:px-3 lg:py-2 bg-white/5 border border-white/30 rounded-xl">
                <div>
                  <p className="flex items-center gap-1 text-[10px] text-slate-300 uppercase tracking-widest font-extrabold mb-0.5"><span className="text-amber-400"><Icon.Star /></span> Experience</p>

                  <p className="text-sm font-extrabold text-white text-center">{officerExperience }+ &nbsp; year{officerExperience > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* CTA to go to complaint queue */}
              <button
                onClick={() => navigate('/officer/complaintqueue')}
                className="flex items-center gap-2 px-2 py-1 lg:px-3 lg:py-2 bg-[#1C49BD] hover:bg-[#1C3C97] text-white text-[12.5px] lg:text-sm font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/40 group"
              >
                <Icon.Zap />
                Go to Queue
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                  <Icon.ArrowRight />
                </span>
              </button>

            </div>
            
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — STAT CARDS GRID
          LEARNING: grid-cols-2 on mobile, grid-cols-3 on md, grid-cols-6 won't
          work cleanly so we use grid-cols-2 md:grid-cols-3 lg:grid-cols-6.
          Each card is intentionally colored differently — avoids the "uniform
          grid" look and gives each metric its own visual weight.
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`relative rounded-2xl bg-gradient-to-br ${card.gradient} p-4 overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-default`}
          >
            {/* Subtle inner glow circle */}
            <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/7 rounded-full" />

            <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center text-white mb-3`}>
              {card.icon}
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${card.sub}`}>
              {card.label}
            </p>
            <p className={`text-3xl font-extrabold ${card.accent}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — PERFORMANCE PANEL
          Split into 3 sub-sections in a responsive grid:
          A) Resolution Rate (progress bar)
          B) Priority Breakdown (bars)
          C) Status Distribution (pills)
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── A. Resolution Rate ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Resolution Rate
          </p>

          {/* Big percentage number */}
          <div className="flex items-end gap-2 mb-4 ">
            <span className="text-5xl font-extrabold text-slate-900 leading-none">
              {stats.resolutionPercent.toFixed(0)}
            </span>
            <span className="text-xl font-bold text-slate-400 mb-1">%</span>
            {/* Contextual label */}
            <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full mb-1
              ${stats.resolutionPercent >= 70
                ? 'bg-emerald-50 text-emerald-600'
                : stats.resolutionPercent >= 40
                ? 'bg-amber-50 text-amber-600'
                : 'bg-rose-50 text-rose-600'
              }`}>
              {stats.resolutionPercent >= 70 ? 'Excellent' : stats.resolutionPercent >= 40 ? 'Average' : 'Needs Work'}
            </span>
          </div>

          {/* Progress bar track */}
          {/* LEARNING: The inner bar width is set via inline style, not Tailwind.
              Because the width is a dynamic value (e.g. 87.5%), Tailwind can't
              generate that class at build time. Dynamic widths MUST use inline style. */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            {/* <div
              className="h-full rounded-full bg-gradient-to-r from-[#1C49BD] to-emerald-500 transition-all duration-700"
              style={{ width: `${Math.min(stats.resolutionPercent, 100)}%` }}
            /> */}

            <div className='h-full rounded-full bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9]transition-all duration-700' 
            style={{ width : `${Math.min(stats.resolutionPercent , 100)}%`}}/>

          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-slate-400">0%</span>
            <span className="text-[10px] text-slate-400">100%</span>
          </div>

          {/* Sub detail */}
          <p className="text-xs text-slate-400 mt-3 font-medium">
            {stats.resolved} of {stats.total} complaints resolved
          </p>
        </div>

        {/* ── B. Priority Breakdown ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Priority Breakdown
          </p>

          <div className="space-y-3">
            {[
              { key: 'highPriority',   type: 'high'   },
              { key: 'mediumPriority', type: 'medium' },
              { key: 'lowPriority',    type: 'low'    },
            ].map(({ key, type }) => {
              const cfg   = PRIORITY_STYLE[type]
              const count = stats[key]
              // LEARNING: Calculate percentage for each priority bar
              // Same guard as before — avoid dividing by zero
              const pct   = stats.total > 0 ? (count / stats.total) * 100 : 0

              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cfg.bg}`} />
                      <span className="text-xs font-semibold text-slate-600">{cfg.label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{count}</span>
                  </div>
                  <div className={`w-full h-2 ${cfg.track} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full ${cfg.bg} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total count footer */}
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</span>
            <span className="text-sm font-extrabold text-slate-700">{stats.total}</span>
          </div>
        </div>

        {/* ── C. Status Distribution (pills) ───────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Status Distribution
          </p>

          {/* LEARNING: This is the "visual pills" section discussed in planning.
              Each pill = one status + its % of total complaints.
              The pill width is also variable (via style) for the mini bar beneath it.
              Together they give a proportional feel at a glance. */}
          <div className="space-y-2.5">
            {STATUS_DIST.map((item) => {
              const pct = stats[item.key] ?? 0
              return (
                <div key={item.key} className="flex items-center gap-3">
                  {/* Status label + percentage */}
                  <div className="flex items-center gap-2 w-28 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
                    <span className="text-xs font-semibold text-slate-600 truncate">{item.label}</span>
                  </div>

                  {/* Mini progress bar */}
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Percentage pill */}
                  <span className="text-xs font-bold text-slate-500 w-10 text-right shrink-0">
                    {pct}%
                  </span>
                </div>
              )
            })}
          </div>

          {/* Fraud callout — highlighted separately because it crosses all statuses */}
          {/* LEARNING: Even though fraud count is already in the stat cards above,
              surfacing it here in a red callout gives it extra visual weight.
              Important signals should appear more than once in a dashboard. */}
          <div className="mt-4 pt-3 border-t border-slate-50">
            <div className="flex items-center justify-between px-3 py-2.5 bg-rose-50 border border-rose-100 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-rose-500"><Icon.AlertTriangle /></span>
                <span className="text-xs font-bold text-rose-700">Fraud Related</span>
              </div>
              <span className="text-sm font-extrabold text-rose-600">{stats.fraudComplaints}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OfficerDashboardPage



