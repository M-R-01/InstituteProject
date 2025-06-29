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
  const [reviewRequests, setReviewRequests] = useState([]);

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

    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/reviewer/review-requests`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setReviewRequests(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the review requests!",
          error
        );
      });
  }, []);

  const handleAccept = (CID) => {
    axios
      .post(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/reviewer/accept-review-request/${CID}`,
        { status: "accepted" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setReviewRequests((prev) =>
          prev.filter((request) => request.Course_id !== CID.Course_id)
        );
      })
      .catch((error) => {
        console.error(
          "There was an error accepting the review request!",
          error
        );
      });
  };

  const handleDecline = (CID) => {
    axios
      .post(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/reviewer/accept-review-request/${CID}`,
        { status: "declined" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setReviewRequests((prev) =>
          prev.filter((request) => request.Course_id !== CID.Course_id)
        );
      })
      .catch((error) => {
        console.error(
          "There was an error declining the review request!",
          error
        );
      });
  };

  const columns = [
    {
      header: "File Name",
      accessorKey: "File_name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Course Name",
      accessorKey: "Course_Name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Feedback",
      cell: (props) => (
        <div>
          <Link to={`/viewFile/${props.row.original.File_id}`}>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Review
            </button>
          </Link>
        </div>
      ),
    },
  ];

  const requestColumns = [
    {
      header: "Course Name",
      accessorKey: "Course_name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Course Description",
      accessorKey: "Course_description",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Faculty",
      accessorKey: "Faculty_Name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Institution",
      accessorKey: "Faculty_Institution",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-col space-y-2 w-full">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => handleAccept(row.row.original.CID)}
          >
            Accept
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => handleDecline(row.row.original.CID)}
          >
            Decline
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: pendingFeedbacks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const requestTable = useReactTable({
    data: reviewRequests,
    columns: requestColumns,
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

          <div className="mt-10 text-black bg-white p-8 rounded-lg shadow-md w-full overflow-auto">
            <h2 className="text-md mb-4">
              You have been requested to review the following courses
            </h2>

            <table
              style={{ width: requestTable.getCenterTotalSize() }}
              className="table-fixed min-w-full text-black border border-gray-600"
            >
              <thead className="bg-[#2b193d] text-white">
                {requestTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="font-bold text-left border border-gray-600 p-2"
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
                {requestTable.getRowModel().rows.length > 0 ? (
                  requestTable.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="text-left border border-gray-600 p-2"
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
                      colSpan={requestTable.getAllColumns().length}
                      className="text-left border border-gray-600 p-2"
                    >
                      No pending feedbacks.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {requestTable.getRowModel().rows.length > 0 && (
              <div className="mt-2">
                <p>
                  Page {requestTable.getState().pagination.pageIndex + 1} of{" "}
                  {requestTable.getPageCount()}
                </p>
                <button
                  className="border border-gray-600 text-sm p-1 mr-2"
                  onClick={() => requestTable.previousPage()}
                  disabled={!requestTable.getCanPreviousPage()}
                >
                  {"<"}
                </button>
                <button
                  className="border border-gray-600 text-sm p-1"
                  onClick={() => requestTable.nextPage()}
                  disabled={!requestTable.getCanNextPage()}
                >
                  {">"}
                </button>
              </div>
            )}
          </div>

          <div className="mt-10 text-black bg-white p-8 rounded-lg shadow-md w-full overflow-auto ">
            <h2 className="text-md mb-4">Pending Feedbacks</h2>

            <table
              style={{ width: table.getCenterTotalSize() }}
              className="table-fixed min-w-full text-black border border-gray-600"
            >
              <thead className="bg-[#2b193d] text-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="font-bold text-left border border-gray-600 p-2"
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
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="text-left border border-gray-600 p-2"
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
                      No pending feedbacks.
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
                  className="border border-gray-600 text-sm p-1 mr-2"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"<"}
                </button>
                <button
                  className="border border-gray-600 text-sm p-1"
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

export default ReviewerHome;
