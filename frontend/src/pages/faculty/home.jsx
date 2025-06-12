import React, { useState, useEffect } from "react";
import Sidebar from "../../components/faculty/sidebar1";
import { FaChevronDown, FaBars } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { GrAdd } from "react-icons/gr";

const HomePage = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [faculty, setFaculty] = useState([]);

  const email = localStorage.getItem("email");
  const FID = localStorage.getItem("FID");

  useEffect(() => {
    axios
      .get(`https://instituteproject.up.railway.app/faculty/${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setFaculty(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the faculty data!", error);
      });

    axios
      .get(`https://instituteproject.up.railway.app/faculty/courses/${FID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      });
  }, []);

  return (
    <div className="flex">
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        username={email || "username"}
      />
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ${
          sidebarToggle ? "ml-0" : "md:ml-60"
        }`}
      >
        <nav className="fixed top-0 left-0 w-full md:w-[calc(100%-16rem)] md:ml-64 bg-white shadow-md p-4 flex justify-between items-center z-10">
          <button
            className="md:hidden text-2xl text-black"
            onClick={() => setSidebarToggle(!sidebarToggle)}
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-bold text-black">Home</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            Faculty
            <FaChevronDown className="ml-2" />
          </button>
        </nav>

        <main className="p-10 pt-24 bg-gray-200 min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl">
            <div className="text-black space-y-3 text-left">
              <p>
                <strong>Name</strong> - {faculty.Faculty_Name}
              </p>
              <p>
                <strong>Department</strong> - {faculty.Faculty_department}
              </p>
              <p>
                <strong>Qualification</strong> - {faculty.Faculty_Qualification}
              </p>
              <p>
                <strong>College</strong> - {faculty.Faculty_Institution}
              </p>
            </div>
          </div>

          <div className="mt-10 bg-white p-8 rounded-lg shadow-md">
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
              <Link to='/faculty/newcourse'>
                <div className="flex items-center">
                  <GrAdd className="mr-2" />
                  Add New Course
                </div>
              </Link>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
