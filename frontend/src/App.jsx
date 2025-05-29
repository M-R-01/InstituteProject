import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginInPage from './pages/LoginInPage.jsx'
import AdminLogin from './pages/admin/adminLogin.jsx'
import AdminHome from './pages/admin/adminHome.jsx'
import AdminCourses from './pages/admin/adminCourses.jsx'
import AdminFaculty from './pages/admin/adminFaculty.jsx'
import RoleSelectionPage from './pages/RoleSelectionPage.jsx'
import HomePage from './pages/faculty/home.jsx'
import SignupPage from './pages/SignupPage.jsx'
import CourseSelectionPage from './pages/NewCoursePage.jsx'

function App() {
  return (
    <>
    <Routes>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path="/" element={<LoginInPage />} />
      <Route path='/roleselection' element={<RoleSelectionPage/>}/>
      <Route path="/navbar" element={<Sidebar />} />
      <Route path="/navbar1" element={<Sidebar1 />} />
      <Route path="/navbar2" element={<Sidebar2 />} />
      <Route path="/home" element={<HomePage />} />
      <Route path='/faculty/home' element={<HomePage/>}/>
      <Route path='/newcourse' element={<CourseSelectionPage/>}/>
      <Route path='/admin' element={<AdminLogin/>}/>
      <Route path="/admin/home" element={<AdminHome/>}/> 
      <Route path="/admin/courses" element={<AdminCourses/>}/>
      <Route path="/admin/faculty" element={<AdminFaculty/>}/>
    </Routes>
    </>

  )
}

export default App