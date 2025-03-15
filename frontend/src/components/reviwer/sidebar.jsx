import React from 'react';
import { GiTeacher } from "react-icons/gi";
import { IoHome, IoSettingsOutline } from 'react-icons/io5';
import { BiLogOut } from 'react-icons/bi';
import { FaBars } from 'react-icons/fa6';

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
              <a href="#" className=" px-3">
                <IoHome className="inline-block w-6 h-6 mr-2 -mt-2" />
                <span className={`${sidebarToggle ? "inline" : "hidden"} md:inline`}>Home</span>
              </a>
            </li>
            <li className="mb-4 rounded hover:shadow hover:bg-gray-500 py-2">
              <a href="#" className=" px-3">
                <GiTeacher className="inline-block w-6 h-6 mr-2 -mt-2" />
                <span className={`${sidebarToggle ? "inline" : "hidden"} md:inline`}>Assigned Course</span>
              </a>
            </li>
            <li className="mb-4 rounded hover:shadow hover:bg-gray-500 py-2">
              <a href="#" className=" px-3">
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