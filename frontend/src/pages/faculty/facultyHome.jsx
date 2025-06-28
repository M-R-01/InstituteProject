import React, { useState, useEffect } from "react";
import Sidebar from "../../components/faculty/sidebar1";
import { FaChevronDown, FaBars, FaSort } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { GrAdd } from "react-icons/gr";
import Nav from "../../components/nav";

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
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/faculty/${email}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setFaculty(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the faculty data!", error);
      });

    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/faculty/waiting-courses/${localStorage.getItem(
          "FID"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setWaitingCourses(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const waitingColumns = [
    {
      header: "Course Name",
      accessorKey: "Course_name",
      cell: (props) => <p>{props.getValue()}</p>,
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
        <Nav
          PageName={"Home"}
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />

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

          <div className="mt-10 bg-white p-8 rounded-lg shadow-md max-w-3xl overflow-auto">
            <Link to="/faculty/newcourse">
              <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4 flex items-center">
                <GrAdd className="mr-2" />
                Add New Course
              </button>
            </Link>

            <h2>Courses Waiting For Approval</h2>

            <table className="table-fixed min-w-full text-left border border-gray-600">
              <thead className="bg-[#2b193d] text-white">
                {waitingTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="font-bold border border-gray-600 p-2"
                      >
                        {header.column.columnDef.header}
                        {header.column.getCanSort() && (
                          <FaSort
                            onClick={header.column.getToggleSortingHandler()}
                            className="inline ml-1 cursor-pointer"
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {waitingTable.getRowModel().rows.length > 0 ? (
                  waitingTable.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="border border-gray-600 p-2 text-black"
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
                      colSpan={waitingTable.getAllColumns().length}
                      className="p-2 text-left"
                    >
                      You have no courses pending approval.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {waitingTable.getRowModel().rows.length > 0 && (
              <div className="mt-2 text-black">
                <p>
                  Page {waitingTable.getState().pagination.pageIndex + 1} of{" "}
                  {waitingTable.getPageCount()}
                </p>
                <button
                  className="border border-gray-600 text-sm p-1 mr-2"
                  onClick={() => waitingTable.previousPage()}
                  disabled={!waitingTable.getCanPreviousPage()}
                >
                  {"<"}
                </button>
                <button
                  className="border border-gray-600 text-sm p-1"
                  onClick={() => waitingTable.nextPage()}
                  disabled={!waitingTable.getCanNextPage()}
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

export default HomePage;
