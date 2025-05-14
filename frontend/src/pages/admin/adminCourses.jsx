import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/sidebar2";
import axios from "axios";
import { FaBars, FaSort } from "react-icons/fa";

import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender
  } from "@tanstack/react-table";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [sidebarToggle, setSidebarToggle] = useState(false);

  useEffect(() => {
    axios.get("https://instituteproject.up.railway.app/admin/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const columns = [
    {
      header: "Course Name",
      accessorKey: "Course_name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Faculty Name",
      accessorKey: "Faculty_Name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Faculty Qualification",
      accessorKey: "Faculty_Qualification",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Faculty Department",
      accessorKey: "Faculty_department",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Faculty Institution",
      accessorKey: "Faculty_Institution",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Reviewer",
      accessorKey: "Reviewer",
      cell: (props) => <p>{props.getValue() == null ? "No Reviewer Assigned" : props.getValue()}</p>,
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (props) => <p>{props.getValue()}</p>,
    }
  ]

  const table = useReactTable({
    data: courses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

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
            <h1 className="text-xl font-bold text-black">Courses</h1>
          </nav>

          <main className="p-10 pt-24 bg-gray-200 min-h-screen overflow-y-scroll overflow-x-scroll">
            <div  className="bg-white p-8 text-black rounded-lg text-center shadow-md max-w-auto">
              <h2 className="mb-6 text-black">All Courses</h2>
              <div style={{ width: table.getCenterTotalSize() }}>
                {table.getRowModel().rows.length > 0 ? (
                  <>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <div key={headerGroup.id} className="flex">
                        {headerGroup.headers.map((header) => (
                          <div
                            key={header.id}
                            style={{width: header.getSize()}}
                            className="w-4xl font-bold text-left text-white bg-[#2b193d] border border-gray-600 p-2"
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
                            style={{ width: cell.column.getSize() }}
                            className="text-left border border-gray-600 p-2"
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
                      No courses available
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

export default AdminCourses;