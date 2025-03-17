import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginInPage from './pages/LoginInPage.jsx'
import RoleSelectionPage from './pages/RoleSelectionPage.jsx'
import HomePage from './pages/faculty/home.jsx'

function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginInPage />} />
      <Route path='/roleselection' element={<RoleSelectionPage/>}/>
      <Route path='/faculty/home' element={<HomePage/>}/>
    </Routes>
    </>

  )
}

export default App