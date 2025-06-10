import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginInPage from './pages/LoginInPage.jsx'
import AdminLogin from './pages/admin/adminLogin.jsx'
import AdminHome from './pages/admin/adminHome.jsx'
import AdminCourses from './pages/admin/adminCourses.jsx'
import AdminFaculty from './pages/admin/adminFaculty.jsx'
import RoleSelectionPage from './pages/RoleSelectionPage.jsx'
<<<<<<< HEAD
import Sidebar from './components/admin/sidebar2.jsx'
import Sidebar1 from './components/faculty/sidebar1.jsx'
import Sidebar2 from './components/reviwer/sidebar.jsx'
import HomePage from './pages/faculty/home.jsx'

=======
import HomePage from './pages/faculty/home.jsx'
import SignupPage from './pages/SignupPage.jsx'
import CourseSelectionPage from './pages/NewCoursePage.jsx'
>>>>>>> e0cb61930e1c6acca97ca4a94e6d6d447af1e2b5

function App() {
  return (
    <>
    <Routes>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path="/" element={<LoginInPage />} />
      <Route path='/roleselection' element={<RoleSelectionPage/>}/>
<<<<<<< HEAD
      <Route path="/navbar" element={<Sidebar />} />
      <Route path="/navbar1" element={<Sidebar1 />} />
      <Route path="/navbar2" element={<Sidebar2 />} />
      <Route path="/home" element={<HomePage />} />

=======
      <Route path='/faculty/home' element={<HomePage/>}/>
      <Route path='/newcourse' element={<CourseSelectionPage/>}/>
      <Route path='/admin' element={<AdminLogin/>}/>
      <Route path="/admin/home" element={<AdminHome/>}/> 
      <Route path="/admin/courses" element={<AdminCourses/>}/>
      <Route path="/admin/faculty" element={<AdminFaculty/>}/>
>>>>>>> e0cb61930e1c6acca97ca4a94e6d6d447af1e2b5
    </Routes>
    </>

  )
}

export default App