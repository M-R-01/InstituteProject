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
      .get(
        "https://instituteproject-1.onrender.com/admin/faculty", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          }
        }
      )
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
      cell: (props) => <p>{props.getValue()}</p>,
      size: 40,
      enableSorting: false,
    },
    {
      header: "Faculty Name",
      accessorKey: "Faculty_Name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Qualification",
      accessorKey: "Faculty_Qualification",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Department",
      accessorKey: "Faculty_department",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Email",
      accessorKey: "Faculty_Email",
      cell: (props) => <p>{props.getValue()}</p>,
      
    },
    {
      header: "Institution",
      accessorKey: "Faculty_Institution",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Courses taught",
      accessorKey: "Number_of_Courses_Taught",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Courses Reviewed",
      accessorKey: "Number_of_Courses_Reviewed",
      cell: (props) => <p>{props.getValue()}</p>,
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
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
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
          <h1 className="text-xl font-bold text-black">Faculty</h1>
        </nav>

        <main className="p-10 pt-24 bg-gray-200 min-h-screen">
          <div className="bg-white p-8 text-black rounded-lg shadow-md w-full overflow-auto">
            <h2 className="mb-4">Courses Waiting For Approval</h2>

            <table
              style={{ width: table.getCenterTotalSize() }}
              className="min-w-full table-fixed border border-gray-600"
            >
              <thead className="bg-[#2b193d] text-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{
                          width:
                            header.column.columnDef.header === "FID"
                              ? "40px"
                              : header.getSize(),
                        }}
                        className="font-bold text-left border border-gray-600 p-2"
                      >
                        <div className="flex items-center justify-between">
                          {header.column.columnDef.header}
                          {header.column.getCanSort() && (
                            <FaSort
                              onClick={header.column.getToggleSortingHandler()}
                              className="ml-1 cursor-pointer"
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            width:
                              cell.column.columnDef.header === "FID"
                                ? "40px"
                                : cell.column.getSize(),
                          }}
                          className="text-left text-black break-words border border-gray-600 p-2"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={table.getAllColumns().length}
                      className="text-left border border-gray-600 p-2"
                    >
                      No faculty data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {table.getRowModel().rows.length > 0 && (
              <div className="mt-2">
                <p>
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </p>
                <button
                  className="border border-gray-600 text-sm p-2 m-1"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"<"}
                </button>
                <button
                  className="border border-gray-600 text-sm p-2 m-1"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {">"}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminFaculty;
