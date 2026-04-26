import React, { useState } from 'react'
import img1 from "../assets/for login page img 2.svg"
// import bankVoice from "../assets/100x100 better logo for banking.png"
import bankVoice1 from "../assets/b logo 500px.png"
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import { useForm } from 'react-hook-form'
import Button from '../components/Button.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/AuthSlice.js'

// bg-gradient-to-br from-blue-900 to-blue-600
// #558EEF

function LoginPage() {

  const [error , setError] = useState("")
  const [loading , setLoading] = useState(false)
  const {register , handleSubmit , formState : { errors }} = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const loginHandler = async (data)=>{
    console.log("data from loginHandler: " , data);

    try {
      setError("")
      setLoading(true)

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          email : data.email ,
          password : data.password
        },
        {
          headers : {
            "Content-Type" : "application/json"
          }
        }
      );

      console.log("Data From Backend: " , response.data)
      console.log("Token From Backend: " , response.data.token)

      localStorage.setItem("userToken" , response.data.token)
      localStorage.setItem("userData" , JSON.stringify(response.data.data))

      dispatch(loginSuccess(response.data.data))

      toast.success(response.data.message ,{
            style: {
              minWidth: "350px",
              maxWidth: "700px",
            }
        })

      console.log("Reached Here!")  
      setTimeout(()=>{
        if(response.data.data.role === "customer") {
          console.log("CUSTOMER ENTERS......")
          navigate("/customer/customerportal")
        }
        else if(response.data.data.role === "bank_officer"){
          console.log("BANK OFFICER ENTERS......")
          navigate("/officer/officerdashboard")
        }
        else if(response.data.data.role === "sbp_admin"){
          console.log("SBP ENTERS......")
          navigate("/sbp/nationalanalytics&complaints")
        }
        else{
          navigate("/home")
        }

      } , 2000)

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Loging Failed" ;
      console.error("Login Error: " , errorMessage) ;
      setError(errorMessage);
      toast.error(errorMessage , {
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

  return (

    <div className="w-screen h-screen p-2 flex gap-2 font-sans">   

      {/* bg-gradient-to-br from-blue-900 to-blue-600 */}
      {/* LEFT SIDE - Hidden on mobile, visible on md+ */}
      <div className='hidden md:flex w-1/2 h-full bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9] flex-col justify-center items-center rounded-3xl p-3'>
            <h1 className='text-white font-extrabold text-4xl mb-2 text-center'>Your Voice. Better Banking.</h1>
            <p className='text-white italic mb-2 text-center'>"Banking disputes? Track & resolve in real-time."</p>
            <img src={img1} alt="img" width="230px" height="230px" className='mt-3' />
      </div>

      {/* RIGHT SIDE - Full width on mobile, half on md+ */}
      {/* F9F3EE */}
      <div className='w-full md:w-1/2 h-full bg-[#F9F3EE] rounded-3xl flex justify-center items-center overflow-y-auto'>
            <div className='border-[3px] border-[#1B4AC1] bg-white pt-2 px-4 sm:px-10 pb-6 flex flex-col rounded-3xl max-w-md w-full my-4 mx-4'>

              <div className="flex justify-center mb-4">
                <img src={bankVoice1} alt="Bank Voice" width="140px" height="140px" className=''/>
              </div>

              <h2 className='text-xl text-center font-bold leading-tight mb-1'>Login to your Account</h2>

              <p className=' text-black/60 mb-2 text-sm text-center'>
                    Don&apos;t have an account?&nbsp;
                    <Link to="/register" className='font-medium text-blue-600 transition-all duration-200 hover:underline'>
                        Sign Up
                    </Link>
              </p>

              {error && <p className='text-red-600 font-bold tracking-wider text-center border border-red-600 px-[3px] py-[2px] italic text-sm'>{error}!</p> }

              <form onSubmit={handleSubmit(loginHandler)} className='mt-3'>
                  <div className='space-y-3'>

                     <Input 
                     type="email" 
                     label="Email: "
                     placeholder="jacobbethell@xyz.com"
                     className="border-[#1C49BD] focus:outline-none focus:border-[#1C49BD] focus:ring-4 focus:ring-[#1C49BD]/10"
                     {...register("email" , {
                        required : "Email is required." ,
                        validate : {
                          matchPattern : (value)=> /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address"
                        }
                     })}
                    />

                    {errors.email && (
                      <p className='text-red-950 italic underline text-sm'>{errors.email.message}</p>
                    )}

                    <Input
                    type="password"
                    label="Password: "
                    placeholder="&lowast;&lowast;&lowast;&lowast;&lowast;&lowast;&lowast;&lowast;&lowast;"
                    className="transition-all duration-200 focus:outline-none focus:border-[#1C49BD] focus:ring-4 focus:ring-[#1C49BD]/10 border-slate-200"
                    {...register("password" , {
                      required : "Password is required." ,
                      minLength : {
                      value : 6 ,
                      message : "Password must be at least 6 characters"
                     }
                    })}
                    />

                    {errors.password && (
                      <p className='text-red-950 italic underline text-sm'>{errors.password.message}</p>
                    )}

                    <Button disabled={loading} type='submit' className={`mt-3 rounded-lg cursor-pointer w-full font-bold px-2 py-2 bg-[#1B4AC1] border border-[#1B4AC1] text-white hover:bg-white hover:text-[#1B4AC1] transition-all duration-200 ${loading ? "opacity-40 cursor-not-allowed" : "cursor-pointer" }`}>
                      {loading ? "Logging In..." : "Login"}
                    </Button>
                    
                  </div>
              </form>

            </div>
      </div>

    </div>
  )
}

export default LoginPage;


