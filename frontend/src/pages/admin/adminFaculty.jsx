/** @format */

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/sidebar2";
import { FaBars, FaSort } from "react-icons/fa6";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

const AdminFaculty = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [facultyData, setFacultyData] = useState([]);

  useEffect(() => {
    axios
      .get("https://instituteproject.up.railway.app/admin/faculty")
      .then((response) => {
        setFacultyData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the faculty data!", error);
      });
  }, []);

  const columns = [
    {
      header: "FID",
      accessorKey: "FID",
    },
    {
      header: "Faculty Name",
      accessorKey: "Faculty_Name",
    },
    {
      header: "Qualification",
      accessorKey: "Faculty_Qualification",
    },
    {
      header: "Department",
      accessorKey: "Faculty_department",
    },
    {
      header: "Email",
      accessorKey: "Faculty_Email",
    },
    {
      header: "Institution",
      accessorKey: "Faculty_Institution",
    },
    {
      header: "Courses taught",
      accessorKey: "Number_of_Courses_Taught",
    },
    {
      header: "Courses Reviewed",
      accessorKey: "Number_of_Courses_Reviewed",
    },
  ];

  const table = useReactTable({
    data: facultyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex">
      <Sidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
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
          <h1 className="text-xl font-bold text-black">Faculty</h1>
        </nav>

        <main className="p-10 pt-24 bg-gray-200 min-h-screen">
          <div className="bg-white p-8 text-black rounded-lg shadow-md max-w-6xl">
            <h2>Courses Waiting For Approval</h2>
            <div style={{ width: table.getCenterTotalSize() }}>
              {table.getRowModel().rows.length > 0 ? (
                <>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <div key={headerGroup.id} className="flex">
                      {headerGroup.headers.map((header) => (
                        <div
                          key={header.id}
                          style={{ width: header.column.columnDef.header === "FID" ? "40px" : header.getSize() }}
                          className="font-bold text-left flex flex-col justify-between text-white bg-[#2b193d] border border-gray-600 p-2"
                        >
                          {header.column.columnDef.header}
                          {header.column.getCanSort() && (
                            <FaSort onClick={header.column.getToggleSortingHandler()} />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  {table.getRowModel().rows.map((row) => (
                    <div key={row.id} className="flex">
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          style={{ width: cell.column.columnDef.header === "FID" ? "40px" : cell.column.getSize() }}
                          className="text-left text-black break-words border border-gray-600 p-2"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                    </div>
                  ))}
                  <p>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </p>
                  <button
                    className="border border-gray-600 text-15"
                    onClick={table.getState().pagination.previousPage}
                  >
                    {"<"}
                  </button>
                  <button
                    className="border border-gray-600 text-15"
                    onClick={table.getState().pagination.nextPage}
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

export default AdminFaculty;
