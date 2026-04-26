import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import bankVoice1 from "../assets/b_logo_500px-removebg-preview.png"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';


// ─── Icons (inline SVGs — no extra dependency needed) ─────────────────────────
const Icons = {
  Home: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  CustomerPortal: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  PostComplaint: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  ComplaintQueue: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  ActionDesk: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  AnalyticalDashboard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  AddOfficer: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  ),
  AddBank: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="9" width="18" height="12" rx="1" />
      <path d="M3 9l9-6 9 6" />
      <line x1="12" y1="12" x2="12" y2="18" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  Logout: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Menu: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ),
  Bank_Officer: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Bank building */}
      <path d="M3 10l9-6 9 6" />
      <rect x="4" y="10" width="16" height="10" rx="1" />

      {/* Officer (head) */}
      <circle cx="12" cy="14" r="2" />

      {/* Officer (shoulders) */}
      <path d="M9.5 18c.5-1.5 4.5-1.5 5 0" />
    </svg>
  ),
};

// ─── Role badge color map ──────────────────────────────────────────────────────
const roleBadgeStyle = {
  customer:     { bg: "bg-blue-100",   text: "text-blue-700",   label: "Customer"     },
  bank_officer: { bg: "bg-amber-100",  text: "text-amber-700",  label: "Bank Officer" },
  sbp_admin:    { bg: "bg-emerald-100",text: "text-emerald-700",label: "SBP Admin"    },
}

// ─── Nav item → icon map ──────────────────────────────────────────────────────
const navIconMap = {
  "/home":                     Icons.Home,
  "/customer/customerportal":  Icons.CustomerPortal,
  "/customer/postcomplaint":   Icons.PostComplaint,
  "/officer/complaintqueue":   Icons.ComplaintQueue,
  "/officer/officerdashboard": Icons.ActionDesk,
  "/sbp/nationalanalytics&complaints":  Icons.AnalyticalDashboard,
  "/sbp/createbank&officer" :  Icons.Bank_Officer
}


function DashboardLayout({ children }) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate()
  const location = useLocation()
  const { reduxUser } = useSelector((state) => state.auth)

  const name = reduxUser?.name || "User"
  const Role = reduxUser?.role || "Guest"

  // Initials for avatar (e.g. "Ali Hassan" → "AH")
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const badge = roleBadgeStyle[Role] || { bg: "bg-slate-100", text: "text-slate-600", label: Role }

  const navItems = [
    { name: "Home",                 slug: "/home",                    accessibleTo: ["customer", "bank_officer", "sbp_admin"] },
    { name: "Customer Portal",      slug: "/customer/customerportal", accessibleTo: ["customer"] },
    { name: "Post Complaint",       slug: "/customer/postcomplaint",  accessibleTo: ["customer"] },
    { name: "Complaint Queue",      slug: "/officer/complaintqueue",  accessibleTo: ["bank_officer"] },
    { name: "Officer Dashboard",          slug: "/officer/officerdashboard",      accessibleTo: ["bank_officer"] },
    { name: "National Complaints Analytics", slug: "/sbp/nationalanalytics&complaints", accessibleTo: ["sbp_admin"] },
    { name: "Add Bank & Officer",     slug: "/sbp/createbank&officer",          accessibleTo: ["sbp_admin"] },
  ]

  const navItemsToAppear = navItems.filter((item) => item.accessibleTo.includes(Role))

  // ── CHANGE 1: Fixed the bug — was a string literal "currentPageMatch.name"
  const currentPageMatch = navItems.find((each) => each.slug === location.pathname)
  const pageTitle = currentPageMatch ? currentPageMatch.name : "Overview"


  return (
    <div className="font-jakarta flex h-screen w-full bg-[#F9F3EE] text-slate-900 overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          bg-[#FDF3D7]/88 md:bg-[#FDF3D7]/50 border-r border-amber-100
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-3 md:justify-center pt-1 border-b border-amber-100/70">
          <img
            src={bankVoice1}
            alt="Bank Voice Logo"
            width="140px"
            height="140px"
            className="object-cover"
          />
          {/* Mobile close button */}
          <button
            className="md:hidden text-slate-400 hover:text-slate-600 pr-3 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            {/* ✕ */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ── CHANGE 2: Nav label + centered nav items with icons ── */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {/* subtle section label */}
          <p className="px-3 mb-3 text-[10px] font-semibold tracking-widest uppercase text-amber-700/50 select-none">
            Navigation
          </p>

          {navItemsToAppear.map((each) => {
            const isActive = each.slug === location.pathname;
            // const isActive = true
            const icon = navIconMap[each.slug];

            return (
              <Link
                key={each.name}
                to={each.slug}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-[#1C49BD] text-white shadow-md shadow-blue-200"
                      : "text-slate-500 hover:bg-amber-100 hover:text-slate-800"
                  }
                `}
              >
                {/* Icon */}
                <span
                  className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#1C49BD]"}`}
                >
                  {icon}
                </span>

                {/* Label */}
                <span className="truncate">{each.name}</span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── CHANGE 3: Logout button — black, with icon ── */}
        {/* hover:text-slate-800
              hover:bg-white/60 bg-slate-900 text-white
              border hover:border-slate-200 border-slate-900
              transition-all duration-200  */}

        <div className="p-3 border-t border-amber-100">
          <button
            className="
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-semibold group
              bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9]
              text-white hover:opacity-90 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300/40 hover:-translate-y-0.5
            "
            onClick={() => {
              setShowLogoutModal(true)
            }}
          >
            <span className="text-white transition-colors">{Icons.Logout}</span>
            Logout
          </button>
        </div>

        {showLogoutModal && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <div
              className="
                w-full max-w-md
                max-h-[90vh] overflow-y-auto
                rounded-3xl bg-white
                border border-slate-200
                shadow-2xl
                p-5 sm:p-6
                animate-in zoom-in-95 duration-200"
            >
              {/* Icon */}
              <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-5 shadow-sm">
                
                <svg
                  className="w-7 h-7 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Door / app frame */}
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  
                  {/* Exit arrow */}
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>

              </div>

              {/* Heading */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                Confirm Logout:
              </h2>

              {/* Message */}
              <p className="text-sm sm:text-[15px] text-slate-500 leading-6 mb-6">
                You are about to end your session....
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="
                    flex-1 py-2 rounded-xl
                    border border-slate-200
                    font-semibold text-slate-600
                    hover:bg-slate-50
                    transition-all duration-200"
          
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    localStorage.clear();
                    toast.success("Session ended successfully");
                    navigate("/login");
                  }}
                  className="
                    flex-1 py-2 rounded-xl
                    font-semibold text-white
                    bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9]
                    hover:opacity-95
                    hover:shadow-lg hover:shadow-blue-300/40
                    hover:-translate-y-0.5
                    transition-all duration-300
                  "
                >
                  Secure Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}




      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col w-full overflow-hidden min-w-0">
        {/* ── TOPBAR ──────────────────────────────────────────────────────────── */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
              onClick={() => setIsSidebarOpen(true)}
            >
              {Icons.Menu}
            </button>

            {/* ── CHANGE 4: Page title — styled with left accent bar ── */}
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:block w-1 h-5 rounded-full bg-[#1C49BD] " />
              <h1 className="text-[17px] font-semibold text-[#074997] tracking-tight font-jakarta italic">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* ── CHANGE 5: User area — avatar, name, role badge ── */}
          <div className="flex items-center gap-2.5">
            <span
              className={`
              hidden sm:inline-flex items-center gap-1.5
              px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider
              border-[1.5px] ${badge.bg} ${badge.text} border-current/30
            `}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              {badge.label}
            </span>

            <span className="hidden sm:block w-px h-5 bg-slate-400" />

            {/* User pill — avatar + name in one container */}
            <div
              className="
              flex items-center gap-2.5
              pl-3 pr-1 py-1
              bg-slate-50 hover:bg-slate-100
              border-[1.5px] border-slate-200 hover:border-slate-300
              rounded-full cursor-default select-none
              hover:shadow-sm transition-all duration-200
              group
            "
            >
              {/* Name + sub-role */}
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-xs font-bold text-slate-800 truncate max-w-[110px]">
                  {name}
                </span>
                <span className="text-[10px] font-medium text-slate-400 truncate max-w-[110px]">
                  {badge.label} account
                </span>
              </div>

              {/* Avatar — circle, inside the pill */}
              <div
                className="
                h-7 w-7 rounded-full shrink-0
                bg-gradient-to-br from-[#1C49BD] to-[#0ea5e9]
                flex items-center justify-center
                text-white text-[11px] font-extrabold
                ring-2 ring-white ring-offset-0
                shadow-sm
              "
              >
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-2 md:p-3">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout




// Project Name: Digital Banking Complaints  & Fraud Reporting System

// Name That I Assigned To This Project and also created the logo for it : Bank Voice 

// Purpose: Platform where customers can file banking complaints, officers can resolve them, and SBP admin can monitor everything.

// The big Context of my project : 3 roles (customer , bank officer , state bank pakistan admin(sbp admin) ) , customer can come and post their any banking related complaint regarding any bank in pakistan along with media support , in this project there is only one bank officer associated with each bank in paksitan , they can take action against the complaint associated with their respective bank , they can change the status to (reject , resolve , in progress , pending)of the complaint and add remarks to the complaint to aware the use that their complaints are considered  and the sbp admin can monitor and analyze all the complaints across pakistan , can see the full stats of complaints across Pakistan . having graphs to analyze which bank has more complaints.Ultimately can see the bank perfomances. In this project i integrate the AI , which is basically reading the complaint description from the customer and coming up with a 2 to 3 word category of a issue(Atm card related , account related etc).

// customer can easily signup and login and officers are created by sbp but officers can login with their valid credentials that sbp gives them . sbp is already created and it can easily login.

// We give special power to sbp to create new banks and new bank officers to maintain flow and security.





// I want you to create the modern , professional , attractive , industry standard , appealing Home page which will remain same in all 3 roles .  i decided that my home page is totally about the motive of the web , the problem it is solving , ultimately the home page mission is  to do marketing of my whole web . i dont have market experience so tahts why i dont know what to show , how to show .....  but i told you that what i am wanting in my home page , plzz make it as impressive as uu can .(modern , professional , attractive , industry standard , appealing , animated(if needed)...). You have a complete freedom to use whatever you want to . Make sure that it must be responsive.



// as uu know that i am using the light colors but it doesnt mean that the home page will be very decent , normal , traditional bcz of light colors . use other colors in order to make the home page as expected and as desired.Colors i used till now , complete freedom to use any color uu want.

// #1C3C97

// #F9F3EE

// white

// black



// ONE DYNAMIC THING IN HOME PAGE:

// the home page will remain same in three roles but one thing in this page will be dynamic :



// before rendering this page i will check out the global state , if the user is not not logged in , you need to show 2 btns for login and signup and if the user is logged in so display the "Go To Dashboard" btn instead of login and signup.





// You have a complete freedom to build how uu want but obey the instructions and come up with something crazy , desired thing. Think and Take your time .





// import React from 'react'
// import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom';

// function HomePage() {

//   const navigate = useNavigate() ;
//   const {isAuthenticated , reduxUser} = useSelector((state)=> state.auth)
//   console.log("isAuthenticated From HomePage: " , isAuthenticated)

//   const roleForHomePage = reduxUser.role;
//   const whereToNavigate = ()=>{
//     if(roleForHomePage === "customer"){
//       navigate("/customer/customerportal")
//     }
//     else if(roleForHomePage === "bank_officer"){
//       navigate("/officer/complaintqueue")
//     }
//     else{
//       navigate("/sbp/analyticaldashboard")
//     }
//   }


//   return (
//     <div></div>
//   )
// }

// export default HomePage

