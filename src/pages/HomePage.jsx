import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import bankVoice2 from "../assets/short_logo-removebg-preview.png"


// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
const Icon = {
  Shield: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  ),
  Cpu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <path strokeLinecap="round" d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  ),
  BarChart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Building: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="9" width="18" height="12" rx="1" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-6 9 6" />
      <line x1="9" y1="22" x2="9" y2="14" /><line x1="15" y1="22" x2="15" y2="14" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Zap: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path strokeLinecap="round" d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  MessageSquare: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
}

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('opacity-100', 'translate-y-0')
            e.target.classList.remove('opacity-0', 'translate-y-8')
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onLogin, onSignup, isAuthenticated, onDashboard }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`fixed font-sans top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-100' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-1">
          <img src={bankVoice2} alt="img" width="50px" height="50px" className='' />

          <span className="font-bold text-[#1C3C97] text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Bank<span className="text-[#0ea5e9]">Voice</span>
          </span>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <button onClick={onDashboard} className="flex items-center gap-2 px-4 py-2 bg-[#1C49BD] text-white text-sm font-semibold rounded-lg hover:bg-[#1C3C97] transition-all duration-200 hover:shadow-lg hover:shadow-blue-200">
              Dashboard <Icon.ArrowRight />
            </button>
          ) : (
            <>
              <button onClick={onLogin} className="px-2 py-2 text-[#1C3C97] text-sm font-semibold hover:bg-blue-50 rounded-lg transition-all border-2 duration-200">
                Login
              </button>
              <button onClick={onSignup} className="px-3 py-2 bg-[#1C49BD] text-white text-sm font-semibold rounded-lg hover:bg-[#1C3C97] transition-all duration-200 hover:shadow-lg hover:shadow-blue-200">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, reduxUser } = useSelector((state) => state.auth)
  console.log("isAuthenticated From HomePage: " , isAuthenticated);
  console.log("reduxUser From HomePage: " , reduxUser);

  useScrollReveal()

  // Dynamic dashboard navigation based on role
  const handleDashboard = () => {
    if (!reduxUser) return
    const routes = {
      customer:     '/customer/customerportal',
      bank_officer: '/officer/officerdashboard',
      sbp_admin:    '/sbp/nationalanalytics&complaints',
    }
    navigate(routes[reduxUser.role] || '/home')
  }

  const handleLogin   = () => navigate('/login')
  const handleSignup  = () => navigate('/register')

  // ── CTA Block (reused in Hero + Final CTA) ──────────────────────────────────
  const CTAButtons = ({ size = 'lg' }) => {
    const base = size === 'lg'
      ? 'px-7 py-3.5 text-base font-semibold rounded-xl'
      : 'px-6 py-3 text-sm font-semibold rounded-xl'

    return isAuthenticated ? (
      <button
        onClick={handleDashboard}
        className={`${base} flex items-center gap-2 bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9] text-white hover:opacity-90 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300/40 hover:-translate-y-0.5`}
      >
        Go to Dashboard <Icon.ArrowRight />
      </button>
    ) : (
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <button
          onClick={handleSignup}
          className={`${base} flex items-center gap-2 bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9] text-white hover:opacity-90 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300/40 hover:-translate-y-0.5`}
        >
          Get Started Free <Icon.ArrowRight />
        </button>
        <button
          onClick={handleLogin}
          className={`${base} border-2 border-[#1C49BD] text-[#1C49BD] hover:bg-[#1C49BD] hover:text-white transition-all duration-300`}
        >
          Login to Account
        </button>
      </div>
    )
  }



  return (
  
    <div className="font-sans min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />  

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <Navbar
        onLogin={handleLogin}
        onSignup={handleSignup}
        isAuthenticated={isAuthenticated}
        onDashboard={handleDashboard}
      />

      {/* ── 1. HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#F9F3EE]">

        {/* Background: soft mesh gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-[#F9F3EE] to-amber-50/60" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#1C49BD]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-gradient-to-tr from-sky-200/30 to-transparent rounded-full blur-3xl" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(#1C49BD 1px, transparent 1px), linear-gradient(90deg, #1C49BD 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div className="space-y-6 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-[#1C49BD] rounded-full text-xs font-semibold tracking-wide border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1C49BD] animate-pulse" />
              AI-Powered Banking Complaints Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Your Voice.<br />
              <span className="bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9] bg-clip-text text-transparent">
                Better Banking.
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-md">
              File banking complaints, track resolutions in real-time, and hold banks accountable — all in one secure platform aligned with State Bank of Pakistan standards.
            </p>

            <CTAButtons size="lg" />

            {/* Trust micro-signals */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {['100% Secure', 'SBP Aligned', 'Free to Use'].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-sm text-slate-500">
                  <span className="text-emerald-500"><Icon.CheckCircle /></span> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Abstract Visual — floating cards */}
          <div className="hidden lg:block relative h-[440px]">
            {/* Main card */}
            <div className="absolute top-8 right-4 w-72 bg-white rounded-2xl shadow-2xl shadow-blue-100/60 border border-slate-100 p-5 animate-float">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">New Complaint</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pending</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-2">ATM Card Blocked Unexpectedly</p>
              <p className="text-xs text-slate-500 mb-3">HBL Bank · Filed just now</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-blue-50 rounded-lg p-2">
                  <div className="text-[10px] text-[#1C49BD] font-bold uppercase tracking-wide mb-0.5">AI Category</div>
                  <div className="text-xs font-semibold text-slate-700">ATM Card Issue</div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-[#1C49BD] to-[#0ea5e9] rounded-lg flex items-center justify-center">
                  <Icon.Cpu />
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className="absolute bottom-16 left-0 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-4 animate-float">
              <p className="text-xs text-slate-400 font-medium mb-3">Complaints Resolved </p>
              <p className="text-3xl font-extrabold text-[#1C49BD]">1268</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <Icon.CheckCircle /> <span>94% resolution rate</span>
              </div>
            </div>

            {/* Small bank badge */}
            <div className="absolute top-46 left-10 bg-gradient-to-br from-[#1C49BD] to-[#0ea5e9] text-white rounded-xl p-3 shadow-lg animate-float">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Banks Covered</p>
              <p className="text-xl font-extrabold">90% <span className='pl-1'>&#x1F1F5;&#x1F1F0;</span> </p>
            </div>

            {/* Floating dots decoration */}
            <div className="absolute top-4 left-20 w-3 h-3 rounded-full bg-[#1C49BD]/20" />
            <div className="absolute bottom-8 right-2 w-5 h-5 rounded-full bg-sky-200/80" />
            <div className="absolute top-36 right-0 w-2 h-2 rounded-full bg-amber-300" />
          </div>
        </div>
      </section>

      {/* ── 2. PROBLEM STATEMENT ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full">The Problem</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">Banking complaints in Pakistan are broken</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">Millions of customers face banking issues daily with no clear, accountable way to resolve them.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Icon.Clock />,
                color: 'bg-rose-50 text-rose-500 border-rose-100',
                stat: '73%',
                title: 'Complaints Unresolved',
                desc: 'Nearly 3 in 4 banking complaints in Pakistan receive no formal follow-up or resolution.',
              },
              {
                icon: <Icon.AlertTriangle />,
                color: 'bg-amber-50 text-amber-500 border-amber-100',
                stat: '6+ Weeks',
                title: 'Average Wait Time',
                desc: 'Customers wait over a month and a half on average to hear back about their complaint.',
              },


              {
                icon: <Icon.Eye />,
                color: 'bg-blue-50 text-[#1C49BD] border-blue-100',
                stat: '0%',
                title: 'Transparency',
                desc: 'No centralized platform exists to track complaint status or hold banks accountable publicly.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal opacity-0 translate-y-8 transition-all duration-700 border-2 rounded-2xl p-6 ${item.color.split(' ')[0]} border-opacity-50`}
                style={{ transitionDelay: `${i * 100}ms`, borderColor: item.color.split(' ')[2] }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                  {item.icon}
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{item.stat}</div>
                <div className="font-semibold text-slate-800 mb-2">{item.title}</div>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SOLUTION OVERVIEW ───────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#1C3C97] via-[#1C49BD] to-[#0369a1] text-white relative overflow-hidden">
        {/* Bg pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-300 bg-white/10 px-3 py-1 rounded-full">The Solution</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold">How Bank Voice Solves This</h2>
            <p className="mt-3 text-blue-200 max-w-xl mx-auto">One platform that connects customers, banks, and regulators — with AI doing the heavy lifting.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Icon.MessageSquare />,
                title: 'Structured Complaints',
                desc: 'Customers file detailed complaints with media attachments. Every complaint is logged, timestamped, and permanently tracked.',
                highlight: false,
              },
              {
                icon: <Icon.Cpu />,
                title: 'AI-Powered Categorization',
                desc: 'Our AI instantly reads your complaint and assigns a precise 2-3 word category — ATM Card Issue, Account Related, Fraud Report — enabling faster routing.',
                highlight: true,
              },
              {
                icon: <Icon.BarChart />,
                title: 'National Oversight',
                desc: 'SBP Admin monitors all complaints across Pakistan with live analytics, graphs, and bank performance reports.',
                highlight: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal opacity-0 translate-y-8 transition-all duration-700 rounded-2xl p-6 ${item.highlight ? 'bg-white text-slate-900 shadow-2xl shadow-black/20 scale-105' : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white'}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {item.highlight && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-xs font-bold text-[#1C49BD] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wide">★ Unique Feature</span>
                  </div>
                )}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.highlight ? 'bg-gradient-to-br from-[#1C49BD] to-[#0ea5e9] text-white' : 'bg-white/15'}`}>
                  {item.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${item.highlight ? 'text-slate-900' : 'text-white'}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${item.highlight ? 'text-slate-500' : 'text-blue-100'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F9F3EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1C49BD] bg-blue-50 px-3 py-1 rounded-full">How It Works</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">Resolve in 3 simple steps</h2>
          </div>

          <div className="relative">
            {/* Connector line — desktop only */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-0.5 bg-gradient-to-r from-[#1C49BD]/20 via-[#1C49BD] to-[#1C49BD]/20 z-0" />

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { step: '01', icon: <Icon.FileText />, title: 'File Your Complaint', desc: 'Customer logs in, selects their bank, describes the issue, attaches media, and submits. AI auto-categorizes instantly.' },
                { step: '02', icon: <Icon.Building />, title: 'Bank Officer Acts', desc: "The bank's officer reviews, adds remarks, and updates the status to In Progress, Resolved, or Rejected." },
                { step: '03', icon: <Icon.CheckCircle />, title: 'Resolution & Transparency', desc: 'Customer is notified of every update. SBP monitors the outcome. Accountability is built in.' },
              ].map((item, i) => (
                <div key={i} className={`reveal opacity-0 translate-y-8 transition-all duration-700 relative z-10 flex flex-col items-center text-center`} style={{ transitionDelay: `${i * 150}ms` }}>
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#1C49BD]/20 flex flex-col items-center justify-center shadow-lg shadow-blue-100/50 mb-4 hover:border-[#1C49BD] hover:shadow-blue-200/60 transition-all duration-300 group">
                    <span className="text-[#1C49BD] group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                    <span className="text-[9px] font-black text-[#1C49BD]/40 mt-0.5 tracking-widest">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. KEY FEATURES ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1C49BD] bg-blue-50 px-3 py-1 rounded-full">Features</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">Everything you need. Nothing you don't.</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Icon.Cpu />, color: 'from-[#1C49BD] to-[#0ea5e9]', title: 'AI Categorization', desc: 'Instant 2-3 word category assigned to every complaint by AI — no manual tagging needed.' },
              { icon: <Icon.Zap />, color: 'from-emerald-500 to-teal-400', title: 'Real-Time Tracking', desc: 'Watch your complaint status update live — Pending, In Progress, Resolved, or Rejected.' },
              { icon: <Icon.Globe />, color: 'from-violet-500 to-purple-400', title: 'All Pakistan Banks', desc: 'Every major Pakistani bank is covered. File against any bank in seconds.' },
              { icon: <Icon.BarChart />, color: 'from-rose-500 to-pink-400', title: 'Analytics Dashboard', desc: 'SBP gets full visibility — complaint volumes, resolution rates, bank performance graphs.' },
            ].map((f, i) => (
              <div
                key={i}
                className="reveal opacity-0 translate-y-8 transition-all duration-700 group bg-white border border-slate-300 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-100/80 hover:-translate-y-1 cursor-default"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WHO IT'S FOR ────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-[#F9F3EE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1C49BD] bg-blue-50 px-3 py-1 rounded-full">Who It's For</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">Built for everyone in the loop</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {
            [
              {
                icon: <Icon.Users />,
                grad: 'from-[#1C49BD] to-[#0ea5e9]',
                tag: 'For Customers',
                title: 'File, Track & Get Heard',
                desc: 'Submit complaints with photos and documents. Track every status change. Know your banking rights.',
                cta: 'Sign Up Free',
                action: handleSignup,
              },
              {
                icon: <Icon.Building />,
                grad: 'from-amber-500 to-orange-400',
                tag: 'For Bank Officers',
                title: 'Manage & Resolve Efficiently',
                desc: 'Your dedicated queue for your bank only. Add remarks, update statuses, and close complaints fast.',
                cta: 'Officer Login',
                action: handleLogin,
              },
              {
                icon: <Icon.Eye />,
                grad: 'from-emerald-500 to-teal-400',
                tag: 'For SBP Regulators',
                title: 'Monitor Across Pakistan',
                desc: 'Full analytics. Every bank. Every complaint. Create officers, manage banks, ensure accountability.',
                cta: 'Admin Access',
                action: handleLogin,
              },
            ].map((r, i) => (
              <div
                key={i}
                className="reveal opacity-0 translate-y-8 transition-all duration-700 bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300 group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.grad} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {r.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{r.tag}</span>
                <h3 className="font-bold text-slate-800 text-lg mt-1 mb-2">{r.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{r.desc}</p>

                {!isAuthenticated && 
                <button
                  onClick={r.action}
                  className={`text-sm font-semibold bg-gradient-to-r ${r.grad} bg-clip-text text-transparent flex items-center gap-1 group-hover:gap-2 transition-all duration-200`}
                >
                  {r.cta} <span className="text-slate-400">→</span>
                </button> }

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TRUST / CREDIBILITY ─────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 reveal opacity-0 translate-y-8 transition-all duration-700">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Why Trust Bank Voice</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Icon.Lock />, color: 'bg-blue-50 text-[#1C49BD]', label: 'Bank-Grade Security' },
              { icon: <Icon.Shield />, color: 'bg-emerald-50 text-emerald-600', label: 'SBP Aligned' },
              { icon: <Icon.CheckCircle />, color: 'bg-amber-50 text-amber-600', label: '100% Transparent' },
              { icon: <Icon.Zap />, color: 'bg-violet-50 text-violet-600', label: 'Always Efficient' },
            ].map((b, i) => (
              <div key={i} className="reveal opacity-0 translate-y-8 transition-all duration-700 flex flex-col items-center gap-2 p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow duration-300" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.color}`}>{b.icon}</div>
                <span className="text-sm font-semibold text-slate-700 text-center">{b.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-8 font-medium">
            ✦ Aligned with State Bank of Pakistan Consumer Protection Standards ✦
          </p>
        </div>
      </section>

      {/* ── 8. FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-[#1C3C97] via-[#1C49BD] to-[#0369a1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center reveal opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Ready to make your<br />
            <span className="text-sky-300">voice heard?</span>
          </h2>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of Pakistanis who are filing complaints, demanding accountability, and getting results.
          </p>
          <div className="flex justify-center">
            <CTAButtons size="lg" />
          </div>
        </div>
      </section>

      {/* ── 9. FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="py-8 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">

            {/* <div className="w-6 h-6 bg-gradient-to-br from-[#1C49BD] to-[#0ea5e9] rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div> */}

            <img src={bankVoice2} alt="img" width="40px" height="40px" className='' />


            <span className="font-bold text-white text-sm">Bank<span className="text-sky-400">Voice</span></span>
          </div>

          <p className="text-slate-400 text-xs text-center">
            © 2026 Bank Voice · Digital Banking Complaints & Fraud Reporting System · Pakistan
          </p>
          <p className="text-slate-500 text-xs">Aligned with SBP Standards</p>
        </div>
      </footer>

      {/* ── Tailwind animation keyframes via style tag ─────────────────────── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `}</style>
    </div>
  )
}

export default HomePage