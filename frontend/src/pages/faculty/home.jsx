import React, { useState, useEffect } from "react";
import Sidebar from "../../components/faculty/sidebar1";
import { FaChevronDown, FaBars } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { GrAdd } from "react-icons/gr";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

const HomePage = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [waitingCourses, setWaitingCourses] = useState([]);

  const email = localStorage.getItem("email");

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
      .get(`https://instituteproject.up.railway.app/faculty/waiting-for-approval`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setWaitingCourses(response.data);
        console.log("Waiting Courses:", response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the waiting courses data!",
          error
        );
      });
  }, []);

  const waitingColumns = [
    {
      header: "Course Name",
      accessorKey: "Course_name",
    },
    {
      header: "Course Description",
      accessorKey: "Course_description",
    },
  ];

  const waitingTable = useReactTable({
    data: waitingCourses,
    columns: waitingColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
              <Link to="/faculty/newcourse">
                <div className="flex items-center">
                  <GrAdd className="mr-2" />
                  Add New Course
                </div>
              </Link>
            </button>
            <h2>Courses Waiting For Approval</h2>
            <div style={{ width: waitingTable.getCenterTotalSize()}} className="text-black">
              {waitingTable.getRowModel().rows.length > 0 ? (
                <>
                  {waitingTable.getHeaderGroups().map((headerGroup) => (
                    <div key={headerGroup.id} className="flex">
                      {headerGroup.headers.map((header) => (
                        <div
                          key={header.id}
                          style={{ width: header.getSize() }}
                          className="w-4xl font-bold text-left text-white bg-[#2b193d] border border-gray-600 p-2"
                        >
                          {header.column.columnDef.header}
                          {header.column.getCanSort() && (
                            <FaSort
                              onClick={header.column.getToggleSortingHandler()}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  {waitingTable.getRowModel().rows.map((row) => (
                    <div key={row.id} className="flex">
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="text-left border border-gray-600 p-2"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  <p>
                    Page {waitingTable.getState().pagination.pageIndex + 1} of{" "}
                    {waitingTable.getPageCount()}
                  </p>
                  <button
                    className="border border-gray-600 text-15"
                    onClick={waitingTable.getState().pagination.previousPage}
                  >
                    {"<"}
                  </button>
                  <button
                    className="border border-gray-600 text-15"
                    onClick={waitingTable.getState().pagination.nextPage}
                  >
                    {">"}
                  </button>
                </>
              ) : (
                <div className="flex">
                  <div className="flex-1 text-left border border-gray-600 p-2">
                    No courses waiting for approval
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
