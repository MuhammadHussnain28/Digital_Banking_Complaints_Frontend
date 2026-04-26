import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'
import toast from 'react-hot-toast'


// ── Validation helpers ───────────────────────────────────────────────────────
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ── Format bank name ────────────────────────────────────────────────────────
const formatBankName = (name) => {
  return name
    .toLowerCase()
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// ── Date formatter ───────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// ICONS — Inline SVG for zero dependencies
// ─────────────────────────────────────────────────────────────────────────────
const Icons = {
  Building: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="9" width="18" height="12" rx="1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-6 9 6" />
      <line x1="9" y1="22" x2="9" y2="14" />
      <line x1="15" y1="22" x2="15" y2="14" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Info: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path strokeLinecap="round" d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),

}

// ─────────────────────────────────────────────────────────────────────────────
// BANK TAB COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function BankTab({ allBanks, bankName, setBankName, isLoading, creatingBank }) {
  // Mock stats for visual richness (in production, these would come from API)
  // Using deterministic calculations based on allBanks.length to avoid impure functions
  const stats = useMemo(
    () => ({
      totalBanks: allBanks.length,
      activeThisMonth: Math.min(allBanks.length, (allBanks.length * 2 + 3) % 10 + 5),
      avgResolutionHours: (allBanks.length * 7 + 12) % 48 + 12,
    }),
    [allBanks],
  )

  // Recent banks (show last 5)
  const recentBanks = useMemo(() => allBanks.slice(-5).reverse(), [allBanks])

  // bg-gradient-to-r from-[#1C3C97] via-[#1C49BD] to-[#0ea5e9]
  return (
    <div className="space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800  overflow-hidden px-6 py-6">
        {/* Texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute -right-12 -top-12 w-42 h-40 bg-white/10 rounded-full pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2 border border-sky-400 rounded-2xl px-1.5 py-0.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sky-200 text-[11px] font-bold uppercase tracking-widest">
              SBP Admin Portal
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            Register New Bank
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Add a new bank to the State Bank of Pakistan's regulated banking network.
            Each bank gets a dedicated officer account for complaint management.
          </p>
        </div>
      </div>


      {/* ── MAIN CONTENT GRID ─────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6 ">

        {/* Left: Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6 ">

          {/* ── STATS CARDS ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 ">
            {[
              {
                label: 'Total Banks',
                value: stats.totalBanks,
                // gradient: 'from-[#1C3C97] to-[#1C49BD]',
                gradient: 'from-[#2547A8] to-[#2D5BC7]',  
                icon: <Icons.Building />,
                subtext: 'Registered with SBP',
              },
              {
                label: 'Active This Month',
                value: stats.activeThisMonth,
                gradient: 'from-slate-950 to-slate-800',
                icon: <Icons.TrendingUp />,
                subtext: '+12% from last month',
              }
            ].map((stat) => (
              <div
                key={stat.label}
                className={` relative rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 overflow-hidden shadow-lg shadow-black/5`}
              >
                <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/10 rounded-full" />
                <div className="flex items-start justify-between relative">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-[10px] text-white/80 mt-1">{stat.subtext}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* Create Bank Form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#1C49BD]/10 flex items-center justify-center text-[#1C49BD]">
                <Icons.Plus />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Bank Details</h2>
                <p className="text-xs text-slate-400">Enter the official bank name as registered with SBP</p>
              </div>
            </div>  

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Bank Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g., Habib Bank, Meezan, UBL"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-350 focus:outline-none focus:ring-2 focus:ring-[#1C49BD]/30 focus:border-[#1C49BD] transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                    <Icons.Building />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <Icons.Info />
                  The word "Bank" will be auto-appended if not included. Name will be properly capitalized.
                </p>
              </div>
 
              <button
                onClick={creatingBank}
                disabled={isLoading || !bankName.trim()}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  isLoading || !bankName.trim()
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9] text-white hover:opacity-90 hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Registering Bank...
                  </>
                ) : (
                  <>
                    <Icons.Shield />
                    Register Bank with SBP
                  </>
                )}
              </button>
            </div>
          </div>


          {/* Guidelines Card */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1C49BD]/10 flex items-center justify-center text-[#1C49BD]">
                <Icons.Info />
              </div>
              <h3 className="text-sm font-bold text-[#1C49BD]">Registration Guidelines</h3>
            </div>
            <ul className="space-y-2.5">
              {[
                'Bank name must be the official registered name with State Bank of Pakistan',
                'Each bank can only have ONE designated complaint officer at a time',
                'After registration, use the "Onboard Officer" tab to assign an officer to this bank',
                'The officer will receive login credentials via email',
                'All complaints filed against this bank will appear in the officer\'s queue',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="text-emerald-500 mt-0.5 shrink-0">
                    <Icons.Check />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Right: Sidebar (1 col) */}
        <div className="space-y-6 ">
          {/* Recently Added Banks */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Recently Added Banks</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 5 banks registered</p>
            </div>
            <div className="divide-y divide-slate-100">
              {recentBanks.length > 0 ? (
                recentBanks.map((bank) => {
                  return (
                  <div key={bank._id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors duration-150">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">  
                      {bank.bankName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{bank.bankName}</p>
                      <p className="text-[10px] text-slate-400">
                        {formatDate(bank.createdAt)}
                      </p>
                    </div>
                    <span className="text-emerald-500">
                      <Icons.Check />
                    </span>
                  </div> )
                })
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-slate-400">No banks registered yet</p>
                </div>
              )}
            </div>

          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Banking Sector Overview</h3>
            <div className="space-y-3">
              {[
                { label: 'National Banks', value: '35', color: 'bg-emerald-100 text-emerald-700' },
                { label: 'Private Banks', value: '20', color: 'bg-blue-100 text-blue-700' },
                { label: 'Islamic Banks', value: '16', color: 'bg-amber-100 text-amber-700' },
                { label: 'Foreign Banks', value: '10', color: 'bg-violet-100 text-violet-700' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Icons.Shield />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                SBP Compliance
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All bank registrations must comply with State Bank of Pakistan regulations.
              Each registered bank is assigned a unique identifier and must maintain
              an active complaint officer for regulatory compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// OFFICER TAB COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function OfficerTab({
  allBanks,
  recentOfficers,
  officerName,
  setOfficerName,
  officerEmail,
  setOfficerEmail,
  officerPassword,
  setOfficerPassword,
  selectedBank,
  setSelectedBank,
  isLoading,
  creatingOfficer,
}) {

  console.log("Recent Officers" , recentOfficers);


  // Password strength checker
  const passwordStrength = useMemo(() => {
    if (!officerPassword) return { strength: 0, label: '', color: '' }
    let strength = 0
    if (officerPassword.length >= 6) strength++
    if (officerPassword.length >= 10) strength++
    if (/[A-Z]/.test(officerPassword)) strength++
    if (/[0-9]/.test(officerPassword)) strength++
    if (/[^A-Za-z0-9]/.test(officerPassword)) strength++
    return {
      strength,
      label: ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength - 1] || '',
      color: ['bg-rose-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500'][strength - 1] || '',
    }
  }, [officerPassword])

  // Officers without bank assignment (mock data for visual richness)
  // Using deterministic calculations based on allBanks.length to avoid impure functions
  const mockOfficerStats = useMemo(
    () => ({
      totalOfficers: allBanks.length,
      activeOfficers: Math.max(0 , allBanks.length - ((allBanks.length * 3) % 3)),
      // pendingComplaints: (allBanks.length * 31 + 10) % 50 + 10,
      // avgResponseTime: (allBanks.length * 11 + 6) % 24 + 6,
    }),
    [allBanks],
  )

  return (
    <div className="space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800  overflow-hidden px-6 py-6">
        {/* Texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute -right-12 -top-12 w-42 h-42 bg-white/10 rounded-full pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2 border border-sky-400 px-1.5 py-0.5 w-fit rounded-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sky-200 text-[11px] font-bold uppercase tracking-widest">
              SBP Admin Portal
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            Onboard Bank Officer
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Assign a dedicated complaint officer to a bank. This officer will manage
            all complaints filed against their assigned bank and report to SBP.
          </p>
        </div>
      </div>

      {/* ── STATS CARDS ─────────────────────────────────────────────────────
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Officers',
            value: mockOfficerStats.totalOfficers,
            gradient: 'from-[#1C3C97] to-[#1C49BD]',
            icon: <Icons.Users />,
            subtext: 'One per bank',
          },
          {
            label: 'Active Officers',
            value: mockOfficerStats.activeOfficers,
            gradient: 'from-emerald-500 to-teal-400',
            icon: <Icons.Check />,
            subtext: 'Currently on duty',
          },
          // {
          //   label: 'Pending Complaints',
          //   value: mockOfficerStats.pendingComplaints,
          //   gradient: 'from-amber-500 to-orange-400',
          //   icon: <Icons.Clock />,
          //   subtext: 'Awaiting response',
          // },
          // {
          //   label: 'Avg Response Time',
          //   value: `${mockOfficerStats.avgResponseTime}h`,
          //   gradient: 'from-sky-500 to-cyan-400',
          //   icon: <Icons.TrendingUp />,
          //   subtext: 'Target: <12h',
          // },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`relative rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 overflow-hidden shadow-lg shadow-black/5`}
          >
            <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/10 rounded-full" />
            <div className="flex items-start justify-between relative">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/60 mt-1">{stat.subtext}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {/* ── MAIN CONTENT GRID ─────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left: Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── STATS CARDS ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: 'Total Officers',
                value: mockOfficerStats.totalOfficers,
                // gradient: 'from-[#1C3C97] to-[#1C49BD]',  
                gradient: 'from-[#2547A8] to-[#2D5BC7]', 
                icon: <Icons.Users />,
                subtext: 'One per bank',
              },
              {
                label: 'Active Officers',
                value: mockOfficerStats.activeOfficers,
                gradient: 'from-slate-950 to-slate-800',
                icon: <Icons.Check />,
                subtext: 'Currently on duty',
              }
            ].map((stat) => (
              <div
                key={stat.label}
                className={`relative rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 overflow-hidden shadow-lg shadow-black/5`}
              >
                <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/10 rounded-full" />
                <div className="flex items-start justify-between relative">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-[10px] text-white/75 mt-1">{stat.subtext}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* Create Officer Form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#1C49BD]/10 flex items-center justify-center text-[#1C49BD]">
                <Icons.Users />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Officer Details</h2>
                <p className="text-xs text-slate-400">Create Officer Account For a Dedicated Bank</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 ">
              {/* Officer Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Officer Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g., Muhammad Ahmed Khan"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-350 focus:outline-none focus:ring-2 focus:ring-[#1C49BD]/30 focus:border-[#1C49BD] transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Official Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    placeholder="officer@bankname.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-350 focus:outline-none focus:ring-2 focus:ring-[#1C49BD]/30 focus:border-[#1C49BD] transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                    <Icons.Lock />
                  </div>
                </div>
                {officerEmail && !isValidEmail(officerEmail) && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <Icons.AlertCircle /> Please enter a valid email address
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  value={officerPassword}
                  onChange={(e) => setOfficerPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-350 focus:outline-none focus:ring-2 focus:ring-[#1C49BD]/30 focus:border-[#1C49BD] transition-all duration-200"
                />
                {/* Password strength indicator */}
                {officerPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[10px] mt-1 ${passwordStrength.strength >= 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      Password strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Bank Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Assign to Bank <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1C49BD]/30 focus:border-[#1C49BD] transition-all duration-200 cursor-pointer"
                  >
                    <option value="" disabled>
                      — Select a bank —
                    </option>
                    {allBanks.map((bank) => (
                      <option key={bank._id} value={bank._id}>
                        {bank.bankName}
                      </option>
                    ))}
                  </select>
                  {/* Custom arrow */}
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {allBanks.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <Icons.AlertCircle /> No banks registered yet. Please register a bank first.
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={creatingOfficer}
              disabled={isLoading || !officerName || !officerEmail || !officerPassword || !selectedBank}
              className={`w-full mt-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                isLoading || !officerName || !officerEmail || !officerPassword || !selectedBank
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9] text-white hover:opacity-90 hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Officer Account...
                </>
              ) : (
                <>
                  <Icons.Shield />
                  Create Officer Account
                </>
              )}
            </button>
          </div>

          {/* Guidelines Card */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1C49BD]/10 flex items-center justify-center text-[#1C49BD]">
                <Icons.Info />
              </div>
              <h3 className="text-sm font-bold text-[#1C49BD]">Officer Onboarding Guidelines</h3>
            </div>
            <ul className="space-y-2.5">
              {[
                'Each bank can only have ONE active complaint officer at a time',
                'Officers can view and respond to all complaints filed against their bank',
                'All officer actions are logged and monitored by SBP for accountability',
                'Officers must respond to complaints within SBP-mandated timeframes',
                'To replace an officer, create a new account (old one can be deactivated separately)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="text-emerald-500 mt-0.5 shrink-0">
                    <Icons.Check />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Sidebar (1 col) */}
        <div className="space-y-6">

          {/* Banks With Officers */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Banks & Officers</h3>
              <p className="text-xs text-slate-400 mt-0.5">Banks with associated officers</p>
            </div>
            <div className="divide-y divide-slate-100">
              {recentOfficers.length > 0 ? (
                recentOfficers.slice(0, 5).map((each) => (
                  <div
                    key={each._id}
                    className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {each.bank_id.bankName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{each.bank_id.bankName}</p>
                      <p className="text-[10px] text-amber-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {each.name}
                      </p>
                    </div>
                    <span className="text-[#1C49BD]">
                      <Icons.ChevronRight />
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-slate-400">No banks registered yet</p>
                  <p className="text-xs text-slate-300 mt-1">Register a bank first</p>
                </div>
              )}
            </div>
          </div>

          {/* Officer Responsibilities */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Officer Responsibilities</h3>
            <div className="space-y-3">
              {[
                {
                  icon: <Icons.Eye />,
                  title: 'Review Complaints',
                  desc: 'Examine each complaint filed against the bank',
                },
                {
                  icon: <Icons.Check />,
                  title: 'Take Action',
                  desc: 'Update status and add remarks for resolution',
                },
                {
                  icon: <Icons.Clock />,
                  title: 'Meet Deadlines',
                  desc: 'Respond within SBP-mandated timeframes',
                },
                {
                  icon: <Icons.Shield />,
                  title: 'Ensure Compliance',
                  desc: 'Follow SBP consumer protection guidelines',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{item.title}</p>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Icons.Lock />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Security Notice
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Officer accounts have elevated privileges. Credentials should be shared
              securely. The officer is personally accountable for all actions taken
              through their account. SBP maintains complete audit logs.
            </p>
          </div>

          {/* SBP Contact */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Icons.Globe />
              </div>
              <h3 className="text-sm font-bold text-emerald-800">SBP Support</h3>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              For technical support or questions about officer onboarding,
              contact the SBP IT Helpdesk at{' '}
              <span className="font-semibold">helpdesk@sbp.org.pk</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function BankAndOfficerPage() {
  const token = localStorage.getItem('userToken')

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('bank')
  const [bankName, setBankName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [officerName, setOfficerName] = useState('')
  const [officerEmail, setOfficerEmail] = useState('')
  const [officerPassword, setOfficerPassword] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [allBanks, setAllBanks] = useState([])
  const [recentOfficers, setRecentOfficers] = useState([]);

  // ── Fetch all banks ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run both requests simultaneously for maximum speed
        const [banksResponse, officersResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getAllBanks`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getBankOfficers`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setAllBanks(banksResponse.data.banks);
        setRecentOfficers(officersResponse.data.officers); // Save your new populated officers!
      }
      catch (error) {
        const errorMessage = error.response?.data?.message || 'Data Not Retrieved From Server!'
        console.error('Data Retrieving Error: ', errorMessage)
        toast.error('Retrieving Of Banks OR Officers Failed, Try Later!', {
          style: {
            minWidth: '350px',
            maxWidth: '700px',
          },
        })
      }
    }
    fetchData()

  }, [])

  // ── Create Bank ───────────────────────────────────────────────────────────
  const creatingBank = async () => {
    if (!bankName) {
      return toast.error('Kindly Enter The Bank Name!', {
        style: { minWidth: '350px', maxWidth: '700px' },
      })
    }

    let finalBankName = bankName.trim()
    if (!finalBankName.toLowerCase().includes('bank')) {
      finalBankName = `${finalBankName} Bank`
    }

    const perfectBankName = formatBankName(finalBankName)
    setBankName(perfectBankName)

    try {
      setIsLoading(true)

      const forBankRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/createBank`,
        { bankName: perfectBankName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      console.log('Response From Backend : ', forBankRes.data)
      toast.success(forBankRes.data?.message || `${perfectBankName} Added In DB.`, {
        style: { minWidth: '350px', maxWidth: '700px' },
      })

      setBankName('')

      // Refresh banks list
      const responseForBanks = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/getAllBanks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setAllBanks(responseForBanks.data.banks)
    }
    catch (error) {
      console.error('Error: ', error.response?.data)
      toast.error(error.response?.data?.message || 'Bank Creation Failed', {
        style: { minWidth: '350px', maxWidth: '700px' },
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ── Create Officer ────────────────────────────────────────────────────────
  const creatingOfficer = async () => {
    if (!officerName || !officerEmail || !officerPassword || !selectedBank) {
      return toast.error('Kindly Fill All The Fields!', {
        style: { minWidth: '350px', maxWidth: '700px' },
      })
    }

    if (!isValidEmail(officerEmail)) {
      return toast.error('Please Enter a Valid Email!', {
        style: { minWidth: '350px', maxWidth: '700px' },
      })
    }
1
    if (officerPassword.length <= 5) {
      return toast.error('Password should be greater than 5 characters!', {
        style: { minWidth: '350px', maxWidth: '700px' },
      })
    }

    try {
      setIsLoading(true)

      const forOfficerRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/createOfficerAC`,
        {
          name: officerName,
          email: officerEmail,
          password: officerPassword,
          bank_id: selectedBank,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      console.log('Response From Backend : ', forOfficerRes.data)
      toast.success(forOfficerRes.data?.message || `${officerName} assigned a role of Bank Officer.`, {
        style: { minWidth: '350px', maxWidth: '700px' },
      })

      setOfficerName('')
      setOfficerEmail('')
      setOfficerPassword('')
      setSelectedBank('')
    } catch (error) {
      console.error('Error: ', error.response?.data)
      toast.error(error.response?.data?.message || 'Officer Creation Failed', {
        style: { minWidth: '350px', maxWidth: '700px' },
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* ── TAB NAVIGATION ────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6">
        {/* bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9] */}
        <button
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            activeTab === 'bank'
              ? 'bg-slate-900 border border-slate-800  text-white shadow-lg shadow-blue-200/50'
              : 'bg-white text-slate-500 border border-slate-200 hover:border-black hover:text-black'
          }`}
        >
          <Icons.Building />
          Register Bank
        </button>
        <button
          onClick={() => setActiveTab('officer')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            activeTab === 'officer'
              ? 'bg-slate-950 border border-slate-800  text-white shadow-lg shadow-blue-200/50'
              : 'bg-white text-slate-500 border border-slate-200 hover:border-black hover:text-black'
          }`}
        >
          <Icons.Users />
          Onboard Officer
        </button>
      </div>

      {/* ── TAB CONTENT ───────────────────────────────────────────────────── */}
      {activeTab === 'bank' ? (
        <BankTab
          allBanks={allBanks}
          bankName={bankName}
          setBankName={setBankName}
          isLoading={isLoading}
          creatingBank={creatingBank}
        />
      ) : (
        <OfficerTab
          allBanks={allBanks}
          recentOfficers={recentOfficers}
          officerName={officerName}
          setOfficerName={setOfficerName}
          officerEmail={officerEmail}
          setOfficerEmail={setOfficerEmail}
          officerPassword={officerPassword}
          setOfficerPassword={setOfficerPassword}
          selectedBank={selectedBank}
          setSelectedBank={setSelectedBank}
          isLoading={isLoading}
          creatingOfficer={creatingOfficer}
        />
      )}
    </div>
  )
}

export default BankAndOfficerPage