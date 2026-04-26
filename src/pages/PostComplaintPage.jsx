import React, { useState, useRef, useEffect } from 'react'
import timelineImg from "../assets/undraw_process_0wew.svg"
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'



// ── Numbered Step Circle ──────────────────────────────────────────────────────
const StepCircle = ({ number, active}) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 transition-all duration-300
    ${active ? 'bg-white text-[#1C49BD] shadow-md shadow-blue-900/20' : 'bg-white/20 text-white/70'}`}>
    {number}
  </div>
)



function PostComplaintPage() {
  const [description, setDescription] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [file, setFile] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [loading , setLoading] = useState(false)
  const [allBanks , setAllBanks] = useState([])
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const MAX_CHARS = 1000

  const token = localStorage.getItem("userToken");
  console.log("token: " , token);

  useEffect(()=>{

    const getBanks = async ()=>{
      try {
        const responseForBanks = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/getAllBanks` ,
          {
            headers : {
              Authorization : `Bearer ${token}`
            }
          }
        );
        
        console.log("Data From Backend: " , responseForBanks.data);
        console.log("Message From Backend: " , responseForBanks.data.message);
        const allBanksInDB = responseForBanks.data.banks;
        console.log("allBanksInDB: " , allBanksInDB)
        setAllBanks(allBanksInDB)

      }
      catch (error) {
        const errorMessage = error.response?.data?.message || "Banks Not Retrieved From Server!";
        console.error("Banks Retrieving Error: ", errorMessage);
        toast.error("Retrieving Of Banks Failed , Try Later!", {
            style: {
              minWidth: "350px",
              maxWidth: "700px",
            },
        });
      }
    }

    getBanks()


  } , [])


  const submitComplaint = async ()=>{
    try {
      setLoading(true);
      const dataContainer = new FormData();
      dataContainer.append("description" , description);
      dataContainer.append("bankID" , selectedBank);
      dataContainer.append("media" , file[0]);


      const responseOfSubmit = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaint/createComplaint` , dataContainer ,
        {
          headers : {
            Authorization : `Bearer ${token}`
            // Axios automatically sets 'Content-Type': 'multipart/form-data' 
            // when it sees you are sending a FormData object! You don't need to write it.
          }
        }
      )

      console.log("Data From Backend: " , responseOfSubmit.data);
      console.log("Message From Backend: " , responseOfSubmit.data.message);
      toast.success(responseOfSubmit.data.message, {
        style: {
          minWidth: "350px",
          maxWidth: "700px",
        },
      });

      setDescription("");
      setSelectedBank("");
      setFile([])

      setTimeout(()=>{
        navigate("/customer/customerportal")
      } , 3000)

    }
    catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit complaint ,  Please try again." ;
      console.error("Submission Error: " , errorMessage) ;
      toast.error(errorMessage ,{
            style: {
              minWidth: "350px",
              maxWidth: "700px",
            },
        })
    }
    finally{
      setLoading(false)
    }

  }



  // Simulate step progression as form fills
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
    if (e.target.value.length > 0 && activeStep < 2) setActiveStep(2)
    if (e.target.value.length === 0) setActiveStep(1)
  }

  const handleBankChange = (e) => {
    setSelectedBank(()=> {
      const newBankId = e.target.value;
      console.log("Clicking on any bank option: " , newBankId)
      console.log("Element Clicked: " , e.target)

      return newBankId
    })
    if (e.target.value && activeStep < 3) setActiveStep(3)
  }

  const handleFileDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = Array.from(e.dataTransfer.files)
    console.log("dropped: " , dropped)
    setFile(dropped) 
    if (dropped.length > 0 && activeStep < 4) setActiveStep(4)
  }

  const handleFileInput = (e) => {
    const selected = Array.from(e.target.files)
    console.log("selected: " , selected)
    setFile(selected)
    if (selected.length > 0 && activeStep < 4) setActiveStep(4)
  }

  const removeFile = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type === 'application/pdf') return '📄'
    return '📎'
  }

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const isFormValid = description.trim().length > 20 && selectedBank

  const steps = [
    { num: 1, label: 'Describe your issue' },
    { num: 2, label: 'Select your bank' },
    { num: 3, label: 'Attach evidence' },
    { num: 4, label: 'Submit complaint' },
  ]


  return (
    <section className="w-full h-full flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-slate-200 shadow-sm font-jakarta min-h-[475px]">

      {/* ── LEFT PANEL (40%) ── Info + Timeline ─────────────────────────────── */}
      <div className="lg:w-[40%] w-full bg-gradient-to-br from-[#1C3C97] via-[#1C49BD] to-[#0284c7] flex flex-col relative md:overflow-visible overflow-hidden" >

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/5 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/[0.02] rounded-full" />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'radial-gradient(white 2px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative flex flex-col h-full p-5 lg:px-4 lg:py-4.5 sm:overflow-hidden   md:overflow-y-auto scrollbar-hide">

          {/* Header */}
          <div className="mb-0">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-2 py-0.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-200 animate-pulse" />
              <span className="text-sky-200 text-[11px] font-semibold tracking-wide uppercase">Secure Submission</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
              File Your<br />
              <span className="text-sky-300">Banking Complaint</span>
            </h1>
            <p className="mt-1 text-blue-200 text-sm leading-relaxed">
              Your complaint is reviewed by the bank officer and monitored by State Bank of Pakistan.
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center my-1 ">
            <img
              src={timelineImg}
              alt="Timeline"
              className="w-32 lg:w-44  h-auto drop-shadow-xl opacity-90"
            />
          </div>

          {/* Live Progress Steps */}
          <div className="mt-1 space-y-0">
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1.5">Your Progress</p>
            {steps.map((step) => {
              const isDone = activeStep > step.num
              // const isDone = true
              const isCurrent = activeStep === step.num
              // const isCurrent = true

              return (
                <div
                  key={step.num}
                  className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-500
                    ${isCurrent ? 'bg-white/15 border-2 border-white/20' : isDone ? 'opacity-80' : 'opacity-40'}`}
                >
                  {/* Circle / Check */}
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 text-xs font-extrabold transition-all duration-300
                    ${isDone ? 'bg-emerald-400 text-white' : isCurrent ? 'bg-white text-[#1C49BD]' : 'bg-white/20 text-white/60'}`}>
                    {isDone ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step.num}
                  </div>
                  <span className={`text-sm font-medium ${isCurrent ? 'text-white' : isDone ? 'text-emerald-300' : 'text-white/50'}`}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="ml-auto text-[10px] text-sky-200 font-semibold animate-pulse tracking-wide">Now</span>
                  )}
                </div>
              )
            })}
          </div>

          
        </div>
      </div>

      {/* ── RIGHT PANEL (60%) ── Form ────────────────────────────────────────── */}
      <div className="lg:w-[60%] w-full bg-[#F9F3EE] flex flex-col overflow-y-auto">
        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between gap-6">

          {/* Top heading */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Complaint Details
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">Fill all fields below. AI will auto-categorize your complaint.</p>
          </div>

          {/* AI badge */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1C49BD] to-[#0ea5e9] flex items-center justify-center shrink-0">
              {/* CPU icon */}
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C49BD] uppercase tracking-wide">AI-Powered Categorization</p>
              <p className="text-xs text-slate-500 mt-0.5">Your complaint description will be auto-categorized (e.g. <em>ATM Card Issue</em>, <em>Fraud Report</em>)</p>
            </div>
          </div>

          {/* ── FIELD 1: Description ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#1C49BD] text-white text-[10px] font-bold flex items-center justify-center">1</span>
              Complaint Description
              <span className="text-rose-400 text-xs">*</span>
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                maxLength={MAX_CHARS}
                rows={5}
                placeholder="Describe your banking issue in detail. What happened? When? What outcome do you expect?"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-350 focus:outline-none focus:ring-2 focus:ring-[#1C49BD]/30 focus:border-[#1C49BD] resize-none transition-all duration-200 leading-relaxed"
              />
              <div className="absolute bottom-2.5 right-3 text-[11px] text-slate-300 font-medium">
                <span className={description.length > MAX_CHARS * 0.9 ? 'text-amber-400' : ''}>
                  {description.length}
                </span>/{MAX_CHARS}
              </div>
            </div>

            {description.length > 0 && description.length < 20 && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                Please provide at least 20 characters for a valid complaint.
              </p>
            )}
          </div>

          {/* ── FIELD 2: Bank Dropdown ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#1C49BD] text-white text-[10px] font-bold flex items-center justify-center">2</span>
              Select Bank
              <span className="text-rose-400 text-xs ml-0.5">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedBank}
                onChange={handleBankChange}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1C49BD]/30 focus:border-[#1C49BD] transition-all duration-200 cursor-pointer"
              >
                <option value="" disabled className="text-slate-300">— Choose your bank —</option>
                {allBanks.map((bank) => (
                  <option key={bank.bankName} value={bank._id}>{bank.bankName}</option>
                ))}
              </select>
              {/* Custom arrow */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── FIELD 3: File Upload ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#1C49BD] text-white text-[10px] font-bold flex items-center justify-center">3</span>
              Attach Evidence
              <span className="text-slate-400 text-xs font-normal ml-1">(optional · max 1 file)</span>
            </label>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => {
                const f = fileInputRef.current?.click();
                console.log("f" , f)
                return f;
              }}
              className={`relative border-2 border-dashed rounded-xl px-4 py-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200
                ${dragOver
                  ? 'border-[#1C49BD] bg-blue-50 scale-[1.01]'
                  : 'border-slate-200 bg-white hover:border-[#1C49BD]/50 hover:bg-blue-50/30'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileInput}
              />
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600">
                  {dragOver ? 'Drop files here' : 'Click to upload or drag & drop'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, PDF, DOC up to 10MB each</p>
              </div>
            </div>

            {/* Attached file pills */}
            {file.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                {file.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-3 py-2 group">
                    <span className="text-lg">{getFileIcon(f)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{f.name}</p>
                      <p className="text-[10px] text-slate-400">{formatBytes(f.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="text-slate-300 hover:text-rose-400 transition-colors duration-200 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── SUBMIT BUTTON ── */}
          <button
            disabled={!isFormValid}
            onClick={submitComplaint}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300
              ${isFormValid
                ? 'bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9] text-white hover:opacity-90 hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-0.5 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
          >
            {isFormValid ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                {loading ? "Submitting..." : "Submit Complaint" }
              </>
            ) : (
              'Complete required fields to submit'
            )}
          </button>

          {/* Small disclaimer */}
          <p className="text-center text-[11px] text-slate-400 -mt-2">
            By submitting, you confirm this complaint is accurate and made in good faith.
          </p>

        </div>
      </div>

    </section>
  )
}

export default PostComplaintPage


