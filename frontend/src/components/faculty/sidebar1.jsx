import React from "react";
import { GiTeacher } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ sidebarToggle, setSidebarToggle }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("FID");
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      <div className="p-4">
        <h1 className="text-xl text-[#2b193d] font-bold">
          Hello,
          <p className="text-s font-medium">{email}</p>
        </h1>
      </div>
      <ul className="text-[#2b193d] font-bold space-y-2 px-4">
        <li className="hover:bg-blue-700 rounded p-2">
          <Link to={`/${role}/home`} className="flex items-center gap-2">
            <IoHome size={20} />
            <span>Home</span>
          </Link>
        </li>
        <li className="hover:bg-blue-700 rounded p-2">
          <Link to={`/${role}/courses`} className="flex items-center gap-2">
            <GiTeacher size={20} />
            <span>{role === "faculty" ? "My Courses" : "Assigned Courses"}</span>
          </Link>
        </li>
      </ul>
      <div className="mt-auto p-4">
        <button
          onClick={logout}
          className="w-full text-left hover:bg-red-300 p-2  rounded flex items-center gap-2"
        >
          <BiLogOut size={20} />
          Log-out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-blue-400 h-screen fixed top-0 left-0 z-20">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarToggle && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30">
          <div className="w-64 bg-blue-400 h-full p-4 relative">
            <button
              onClick={() => setSidebarToggle(false)}
              className="absolute top-2 right-2 text-[#B98389] font-bold text-xl"
            >
              {"<"}
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
