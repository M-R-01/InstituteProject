import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginInPage from './pages/LoginInPage.jsx'
import RoleSelectionPage from './pages/RoleSelectionPage.jsx'

function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginInPage />} />
      <Route path='/roleselection' element={<RoleSelectionPage/>}/>
    </Routes>
    </>

  )
}

export default App