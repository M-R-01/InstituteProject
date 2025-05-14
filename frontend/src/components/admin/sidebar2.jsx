import React from 'react';
import { IoHome, IoSettingsOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { FaBars } from 'react-icons/fa6';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { PiStudentFill } from 'react-icons/pi';

const Sidebar = ({ sidebarToggle, setSidebarToggle }) => {
  return (
    <div>
      <button
        className="p-2 md:hidden"
        onClick={() => setSidebarToggle(!sidebarToggle)}
        aria-label="Toggle Sidebar"
      >
        <FaBars />
      </button>

      
      <div
        className={`${
          sidebarToggle ? "block" : "hidden"
        } md:block w-64 bg-blue-400 flex flex-col fixed h-full px-4 py-2 transition-all duration-300 ease-in-out`}
      >
        <div className="flex-grow p-4">
          
          <h1 className="text-xl text-black font-bold md:block">
            Hello,
            <p>Username!!</p>
          </h1>

          
          <ul className="mt-3 text-black font-bold py-3">
            <li className="mb-4 rounded hover:shadow hover:bg-gray-500 py-2">
              <Link to="/admin/home">
                <IoHome className="inline-block w-6 h-6 mr-2 -mt-2" />
                <span className={`${sidebarToggle ? "inline" : "hidden"} md:inline`}>Home</span>
              </Link>
            </li>
            <li className="mb-4 rounded hover:shadow hover:bg-gray-500 py-2">
              
                <LiaChalkboardTeacherSolid className="inline-block w-6 h-6 mr-2 -mt-2" />
                <span className={`${sidebarToggle ? "inline" : "hidden"} md:inline`}>Faculty</span>
            </li>
            <li className="mb-4 rounded hover:shadow hover:bg-gray-500 py-2">
              <Link to="/admin/courses">
                <PiStudentFill className="inline-block w-6 h-6 mr-2 -mt-2" />
                <span className={`${sidebarToggle ? "inline" : "hidden"} md:inline`}>Courses</span>
              </Link>
            </li>
            <li className="mb-4 rounded hover:shadow hover:bg-gray-500 py-2">
              <a href="#">
                <IoSettingsOutline className="inline-block w-6 h-6 mr-2 -mt-2 " />
                <span className={`${sidebarToggle ? "inline" : "hidden"} md:inline`}>Settings</span>
              </a>
            </li>
          </ul>
        </div>

        
        <div className="absolute bottom-0  p-4 rounded hover:shadow hover:bg-red-300  ">
          <a href="#" className=" p-3">
            <BiLogOut className="inline-block w-6 h-6 mr-2 -mt-2" />
            <span className={`${sidebarToggle ? 'block' : "hidden"} md:block`}>Log-out!</span>
          </a>
        </div>
    </div>
    </div>
  );
};

export default Sidebar;