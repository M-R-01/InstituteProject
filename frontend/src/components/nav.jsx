import React, {useState,useEffect} from "react";
import { FaBars } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";

const Nav = ({PageName}) => {
    const [sidebarToggle, setSidebarToggle] = useState(false);
    const role = localStorage.getItem("role");

    const navigate = useNavigate();

    const handleRoleChange = () => {
        if (role === "faculty") {
            localStorage.setItem("role", "reviewer");
            navigate("/reviewer/home");
        } else if (role === "reviewer") {
            localStorage.setItem("role", "faculty");
            navigate("/faculty/home");
        }
    }
    
    return (
        <nav className="fixed top-0 left-0 w-full md:w-[calc(100%-16rem)] md:ml-64 bg-white shadow-md p-4 flex justify-between items-center z-10">
                  <button
                    className="md:hidden text-2xl text-black"
                    onClick={() => setSidebarToggle(!sidebarToggle)}
                  >
                    <FaBars />
                  </button>
                  <h1 className="text-xl font-bold text-black">{PageName}</h1>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center" onClick={handleRoleChange}>
                    <TfiReload className="mr-2" />
                    {role === "faculty" ? "Faculty" : "Reviewer"}
                  </button>
                </nav>
    );
}

export default Nav;