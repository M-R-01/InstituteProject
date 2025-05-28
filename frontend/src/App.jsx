import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginInPage from './pages/LoginInPage.jsx'
import RoleSelectionPage from './pages/RoleSelectionPage.jsx'
import Sidebar from './components/admin/sidebar2.jsx'
import Sidebar1 from './components/faculty/sidebar1.jsx'
import Sidebar2 from './components/reviwer/sidebar.jsx'
import HomePage from './pages/faculty/home.jsx'


function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginInPage />} />
      <Route path='/roleselection' element={<RoleSelectionPage/>}/>
      <Route path="/navbar" element={<Sidebar />} />
      <Route path="/navbar1" element={<Sidebar1 />} />
      <Route path="/navbar2" element={<Sidebar2 />} />
      <Route path="/home" element={<HomePage />} />

    </Routes>
    </>

  )
}

export default App