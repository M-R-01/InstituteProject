import React from 'react';
import { IoHome, IoSettingsOutline } from 'react-icons/io5';
import { BiLogOut } from 'react-icons/bi';
import { FaBars } from 'react-icons/fa6';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { PiStudentFill } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';


const Sidebar = ({ sidebarToggle, setSidebarToggle }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };


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
              <Link to={"/admin/home"} className=" px-3">
                <IoHome className="inline-block w-6 h-6 mr-2 -mt-2" />
                <span className={`${sidebarToggle ? "inline" : "hidden"} md:inline`}>Home</span>
              </Link>
            </li>
            <li className="mb-4 rounded hover:shadow hover:bg-gray-500 py-2">
              <Link to={"/admin/faculty"} className=" px-3">
                <LiaChalkboardTeacherSolid className="inline-block w-6 h-6 mr-2 -mt-2" />
                <span className={`${sidebarToggle ? "inline" : "hidden"} md:inline`}>Faculty</span>
              </Link>
            </li>
            <li className="mb-4 rounded hover:shadow hover:bg-gray-500 py-2">
              <Link to={"/admin/courses"} className=" px-3">
                <PiStudentFill className="inline-block w-6 h-6 mr-2 -mt-2" />
                <span className={`${sidebarToggle ? "inline" : "hidden"} md:inline`}>Reviwer</span>
              </Link>
            </li>
          </ul>
        </div>

        <button
          onClick={logout}
          className="w-full text-left hover:bg-red-300 p-2  rounded flex items-center gap-2"
        >
          <BiLogOut size={20} />
          Log-out
        </button>

    </div>
    </div>
  );
};

export default Sidebar;
