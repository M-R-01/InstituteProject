import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/faculty/sidebar1";
import { FaChevronDown, FaBars, FaSort } from "react-icons/fa";
import { Link } from "react-router-dom";
import Nav from "../../components/nav";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

const ReviewerHome = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [faculty, setFaculty] = useState({});
  const [pendingFeedbacks, setPendingFeedbacks] = useState([]);

  const email = localStorage.getItem("email");
  const navigate = useNavigate();

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
        navigate("/login");
      });

    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/reviewer/pending-feedbacks/${localStorage.getItem(
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
        setPendingFeedbacks(response.data);
      });
  }, []);

  const columns = [
    {
      header: "File Name",
      accessorKey: "File_name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "File Link",
      accessorKey: "File_link",
        cell: (props) => (
            <a
            href={props.getValue()}
            className="text-blue-500 underline"
            >
            {props.getValue()}
            </a>
        ),
    },
    {
      header: "Feedback",
      cell: (props) => <div>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View
        </button>
      </div>,
    },
  ]

  const table = useReactTable({
    data: pendingFeedbacks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })


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
        <Nav PageName={"Home"} />

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

          <div className="mt-10 text-black bg-white p-8 rounded-lg shadow-md max-w-3xl">
            <h2>Pending Feedbacks</h2>
            <div
              style={{ width: table.getCenterTotalSize() }}
              className="text-black"
            >
              {table.getRowModel().rows.length > 0 ? (
                <>
                  {table.getHeaderGroups().map((headerGroup) => (
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
                  {table.getRowModel().rows.map((row) => (
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
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
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

export default ReviewerHome;
