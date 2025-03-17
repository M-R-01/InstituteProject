import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginInPage from './pages/LoginInPage.jsx'
import RoleSelectionPage from './pages/RoleSelectionPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import CourseSelectionPage from './pages/NewCoursePage.jsx'

function App() {
  return (
    <>
    <Routes>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path="/login" element={<LoginInPage />} />
      <Route path='/roleselection' element={<RoleSelectionPage/>}/>
      <Route path='/newcourse' element={<CourseSelectionPage/>}/>
    </Routes>
    </>

  )
}

export default App