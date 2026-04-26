import React, { useState } from 'react'
import img1 from "../assets/for login page img 2.svg"
import bankVoice1 from "../assets/b logo 500px.png"
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import { useForm } from 'react-hook-form'
import Button from '../components/Button.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'


function RegisterPage() {

  const [error , setError] = useState("")
  const [loading , setLoading] = useState(false)
  const {register , handleSubmit , formState : { errors } } = useForm()
  const navigate = useNavigate()

  const registerHandler = async (data)=>{
    console.log("data from registerHandler: " , data);

    try {
        setError("");
        setLoading(true);
        
        const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register` , 
        {
            name : data.fullname ,
            email : data.email ,
            password : data.password
        } ,
        {
            headers : {
                'Content-Type' : 'application/json'
            }
        });

        console.log("Response: " , response)
        console.log("Data From Backend: " , response.data)

        toast.success(response.data.message, {
          style: {
            minWidth: "350px",
            maxWidth: "700px",
          }
        });

        setTimeout(()=>{
            navigate("/login")
        } , 2000)

    }
    catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        console.error("Registration Error: " , errorMessage);
        setError(errorMessage);
        toast.error(errorMessage,{
            style: {
              minWidth: "350px",
              maxWidth: "700px",
            },
        });
    }
    finally{
        setLoading(false)
    }

  } 

  return (

    // bg-gradient-to-br from-blue-900 to-blue-600
    <div className="w-screen h-screen p-2 flex gap-2 font-sans">   

      {/* LEFT SIDE - Hidden on mobile, visible on md+ */}
      <div className='hidden md:flex w-1/2 h-full bg-gradient-to-r from-[#1C49BD] to-[#0ea5e9] flex-col justify-center items-center rounded-3xl p-3'>
            {/*    ↑ hidden md:flex = hide on mobile, show on medium+ */}
            <h1 className='text-white font-extrabold text-4xl mb-2 text-center'>Your Voice. Better Banking.</h1>
            <p className='text-white italic mb-2 text-center'>"Banking disputes? Track & resolve in real-time."</p>
            <img src={img1} alt="img" width="230px" height="230px" className='mt-3' />
      </div>

      {/* RIGHT SIDE - Full width on mobile, half on md+ */}
      <div className='w-full md:w-1/2 h-full bg-[#f9f3ee] px-3 rounded-3xl flex justify-center items-center overflow-y-auto'>
            {/*    ↑ w-full md:w-1/2 = full width mobile, half on medium+ */}
            {/*                                           ↑ overflow-y-auto = scroll if needed */}
            
            <div className='border-[3px] border-[#1B4AC1] bg-white pt-0 px-4 sm:px-10 pb-4 flex flex-col rounded-3xl overflow-hidden max-w-md w-full my-4'>
                  {/*                                          ↑ px-4 sm:px-10 = less padding on mobile */}
                  {/*                                                           ↑ max-w-md = limit max width */}
                  {/*                                                                  ↑ w-full = take available width */}
                  {/*                                                                         ↑ my-4 = margin for breathing room */}

              <div className="flex justify-center mb-4">
                <img src={bankVoice1} alt="Bank Voice" width="140px" height="140px" className=''/>
              </div>

              <h2 className='text-xl text-center font-bold leading-tight mb-1'>Register your Account</h2>

              <p className=' text-black/60 mb-2 text-sm text-center'>
                    Already have an account?&nbsp;
                    <Link to="/login" className='font-medium text-blue-600 transition-all duration-200 hover:underline'>
                        Login
                    </Link>
              </p>

              {error && <p className='text-red-600 font-bold tracking-wider text-center border border-red-600 px-[3px] py-[2px] italic text-sm'>{error}!</p> }

              <form onSubmit={handleSubmit(registerHandler)} className='mt-2 '>
                  <div className='space-y-2'>

                    <Input
                    label="Full Name: "
                    placeholder="Kane Williamson"
                    {...register("fullname" , {
                        required : "Full name is required."
                    })}
                    />

                    {errors.fullname && (
                        <p className='text-red-950 italic underline text-sm'>{errors.fullname.message}</p>
                    )}

                     <Input 
                     type="email" 
                     label="Email: "
                     placeholder="kanewilliamson@xyz.com"
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

                    <Button disabled={loading} type='submit' className='mt-2 rounded-lg cursor-pointer w-full font-bold px-2 py-2 border border-[#1B4AC1] bg-[#1B4AC1] text-white hover:bg-white hover:text-[#1B4AC1] transition-all duration-200'>
                      {loading ? "Creating Account...." : "Register"}
                    </Button>
                    
                  </div>
              </form>

            </div>
      </div>

    </div>
  )
}

export default RegisterPage;