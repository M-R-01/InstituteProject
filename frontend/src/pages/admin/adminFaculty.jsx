import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/sidebar2";
import { FaBars } from "react-icons/fa6";


const AdminFaculty = () => {
    const [sidebarToggle, setSidebarToggle] = useState(false);

    return (
        <div className="flex">
      <Sidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
      <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarToggle ? "ml-0" : "md:ml-60"}`}>
        <nav className="fixed top-0 left-0 w-full md:w-[calc(100%-16rem)] md:ml-64 bg-white shadow-md p-4 flex justify-between items-center z-10">
          <button className="md:hidden text-2xl text-black" onClick={() => setSidebarToggle(!sidebarToggle)}>
            <FaBars />
          </button>
          <h1 className="text-xl font-bold text-black">Faculty</h1>
        </nav>

        <main className="p-10 pt-24 bg-gray-200 min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
            
          </div>
        </main>
      </div>
    </div>
    )
}

export default AdminFaculty;