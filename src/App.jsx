import React, { useEffect, useState } from 'react'
import DashboardLayout from './layout/DashboardLayout'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { useDispatch } from 'react-redux'
import { loginSuccess } from './store/AuthSlice.js'
import PostComplaintPage from './pages/PostComplaintPage.jsx'
import CustomerPortal from './pages/CustomerPortalPage.jsx'
import OfficerDashboardPage from './pages/OfficerDashboardPage.jsx'
import OfficerComplaintsQueue from './pages/OfficerComplaintsQueue.jsx'
import BankAndOfficerPage from './pages/BankAndOfficerPage.jsx'
import NationalComplaintsAnalytics from './pages/NationalComplaintsAnalytics.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'

const router = createBrowserRouter([
    // 🌍 THE PUBLIC WORLD
    {
      path : "/" ,
      element : <HomePage/>
    },
    {
      path : "/login" ,
      element : <LoginPage/>
    },
    {
      path : "/register" ,
      element : <RegisterPage/>
    },
    {
      path : "/home" ,
      element : <HomePage/>
    },
    {
      path : "/customer/customerportal"  ,
      element : (
        <ProtectedRoute allowedRoles={["customer"]}>
          <DashboardLayout>
            <CustomerPortal/>
          </DashboardLayout>
        </ProtectedRoute>
    )
    },
    {
      path : "/customer/postcomplaint" ,
      element : (
        <ProtectedRoute allowedRoles={["customer"]}>
          <DashboardLayout>
            <PostComplaintPage/>
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path : "/officer/officerdashboard" ,
      element : (
        <ProtectedRoute allowedRoles={["bank_officer"]}>
          <DashboardLayout>
            <OfficerDashboardPage/>
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path : "/officer/complaintqueue" ,
      element : (
        <ProtectedRoute allowedRoles={["bank_officer"]}>
          <DashboardLayout>
            <OfficerComplaintsQueue/>
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path : "/sbp/createbank&officer" ,
      element : (
        <ProtectedRoute allowedRoles={["sbp_admin"]}>
          <DashboardLayout>
            <BankAndOfficerPage/>
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path : "/sbp/nationalanalytics&complaints" ,
      element : (
        <ProtectedRoute allowedRoles={["sbp_admin"]}>
          <DashboardLayout>
            <NationalComplaintsAnalytics/>
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    

]);


function App() {

  const [isInitializing, setIsInitializing] = useState(true);

  const dispatch = useDispatch() ;

  useEffect(()=>{
    const savedToken = localStorage.getItem("userToken");
    const savedData = JSON.parse(localStorage.getItem("userData")) ;

    console.log(`Saved Token : ${savedToken}
      Saved User : ${savedData}
    `)

    if(savedData && savedToken){
      dispatch(loginSuccess(savedData))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    setIsInitializing(false);

  } , [dispatch])


  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="animate-spin h-10 w-10 border-4 border-[#1C49BD] border-t-transparent rounded-full"></div>
      </div>
    );
  }


  return <RouterProvider router={router}/>
  
}

export default App

