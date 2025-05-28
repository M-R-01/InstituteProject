import React, { useState } from "react";
import Sidebar from "../../components/faculty/sidebar1";
import { FaChevronDown, FaBars } from "react-icons/fa";

const HomePage = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  return (
    <div className="flex">
      <Sidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
      <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarToggle ? "ml-0" : "md:ml-64"}`}>
        <nav className="fixed top-0 left-0 w-full md:w-[calc(100%-16rem)] md:ml-64 bg-white shadow-md p-4 flex justify-between items-center z-10">
          <button className="md:hidden text-2xl text-black" onClick={() => setSidebarToggle(!sidebarToggle)}>
            <FaBars />
          </button>
          <h1 className="text-xl font-bold text-black">Home</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            Faculty
            <FaChevronDown className="ml-2" />
          </button>
        </nav>

        <main className="p-10 pt-24 bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
            <div className="text-black space-y-3 text-left">
              <p><strong>Name</strong> - John Doe</p>
              <p><strong>Role</strong> - Faculty</p>
              <p><strong>Department</strong> - Production Engineering</p>
              <p><strong>Qualification</strong> - B.Tech, M.Tech Biotechnology</p>
              <p><strong>Course Name</strong> - Introduction to Biotechnology and its applications</p>
              <p><strong>College</strong> - National Institute of Technology, Tiruchirappalli</p>
              <p><strong>Reviewers Assigned</strong> - John Doe, Prince Smallman</p>
              <p className="mt-4 font-bold text-black text-center">{`{Other details required}`}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;