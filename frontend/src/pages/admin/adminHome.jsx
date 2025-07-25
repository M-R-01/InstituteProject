/** @format */

import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/sidebar2";
import { FaBars, FaSort } from "react-icons/fa";
import axios from "axios";
import { showFacultyToast } from "../../components/faculty/FacultyToast";
import CheckboxColumnFilter from "../../components/filterbox";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

const AdminHome = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [courseCount, setCourseCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);
  const [avgResourcesPerCourse, setAvgResourcesPerCourse] = useState(0);

  const [waitingCourses, setWaitingCourses] = useState([]);
  const [pendingFeedbacks, setPendingFeedbacks] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/metrics",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setCourseCount(response.data.courseCount);
        setFacultyCount(response.data.facultyCount);
        setResourceCount(response.data.fileCount);
        setAvgResourcesPerCourse(response.data.filePerCourse);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/get-waiting-courses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setWaitingCourses(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/check-feedbacks",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        console.log("Pending feedbacks:", response.data);
        setPendingFeedbacks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  {
    /* Functions to handle course approval */
  }
  const handleApprove = (row) => {
    console.log(row);
    axios
      .post(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/approve-waiting-courses",

        {
          courseName: row.Course_name,
          courseDescription: row.Course_description,
          status: "approved",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        console.log("Course approved:", response.data);
        showFacultyToast("Course approved successfully", "success");
        setWaitingCourses((prevCourses) =>
          prevCourses.filter((course) => course.Course_name !== row.Course_name)
        );
      })
      .catch((error) => {
        console.error("Error approving course:", error);
        showFacultyToast("Error approving course", "error");
      });
  };

  const handleReject = (row) => {
    axios
      .post(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/approve-waiting-courses",
        {
          courseName: row.Course_name,
          courseDescription: row.Course_description,
          status: "rejected",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        console.log("Course rejected:", response.data);
        showFacultyToast("Course rejected successfully", "success");
        setWaitingCourses((prevCourses) =>
          prevCourses.filter((course) => course.Course_name !== row.Course_name)
        );
      })
      .catch((error) => {
        showFacultyToast("Error rejecting course", "error");
      });
  };

  {
    /*Functions to send reminder to reviewers*/
  }
  const sendReminder = (row) => {
    axios
      .post(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/send-reminder/${row.CID}`,
        {
          courseName: row.Course_Name,
          fileName: row.File_name,
          reviewerEmail: row.Reviewer_Email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        console.log("Reminder sent:", response.data);
        showFacultyToast("Reminder sent successfully", "success");
      })
      .catch((error) => {
        console.error("Error sending reminder:", error);
        showFacultyToast("Error sending reminder", "error");
      });
  };

  const sendReminderAll = () => {
    axios
      .post(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/send-reminder",
        {
          feedbacks: pendingFeedbacks,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        console.log("Reminder sent:", response.data);
        showFacultyToast("Reminder sent successfully", "success");
      })
      .catch((error) => {
        showFacultyToast("Error sending reminder", "error");
      });
  };

  {
    /* Columns for waiting courses and pending feedbacks tables */
  }
  const waitingColumns = [
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
      header: "Approve/Reject",
      cell: (row) => (
        <div className="flex flex-col space-y-2 w-full">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => handleApprove(row.row.original)}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => handleReject(row.row.original)}
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  const pendingColumns = [
    {
      header: "CID",
      accessorKey: "CID",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: false,
    },
    {
      header: "Course Name",
      accessorKey: "Course_Name",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "File Name",
      accessorKey: "File_name",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-col space-y-2 w-full">
          <button
            className="bg-green-500 text-white m-1 px-1 py-1 rounded"
            onClick={() => sendReminder(row.row.original)}
          >
            Send Reminder
          </button>
        </div>
      ),
    },
  ];

  {
    /*Table setup for waiting courses and pending feedbacks */
  }
  const waitingTable = useReactTable({
    data: waitingCourses,
    columns: waitingColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const pendingTable = useReactTable({
    data: pendingFeedbacks,
    columns: pendingColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
          <h1 className="text-xl font-bold text-black">Home</h1>
        </nav>

        <main className="p-10 pt-24 min-h-screen">
          {/*Statistics Details Section*/}
          <div className="flex flex-wrap justify-between  mb-10">
            <div className="bg-white text-black text-center p-8 w-72 rounded-lg shadow-md">
              <p className="text-sm font-bold">No. of Courses</p>
              <p className="text-3xl">{courseCount}</p>
            </div>

            <div className="bg-white text-black text-center p-8 w-72 rounded-lg shadow-md">
              <p className="text-sm font-bold">No. of Faculty</p>
              <p className="text-3xl">{facultyCount}</p>
            </div>

            <div className="bg-white text-black text-center p-8 w-72 rounded-lg shadow-md">
              <p className="text-sm font-bold">No. of Resources</p>
              <p className="text-3xl">{resourceCount}</p>
            </div>

            <div className="bg-white text-black text-center p-8 w-72 rounded-lg shadow-md">
              <p className="text-sm font-bold">Avg. Resources per Course</p>
              <p className="text-3xl">{avgResourcesPerCourse}</p>
            </div>
          </div>

          {/*Courses Waiting For Approval Section*/}
          <div className="bg-white p-8 text-black rounded-lg shadow-md mt-5 mb-10 w-full overflow-auto">
            <h2 className="text-md mb-4">Courses Waiting For Approval</h2>

            <table
              style={{ width: waitingTable.getCenterTotalSize() }}
              className="table-fixed min-w-full text-black border border-gray-600"
            >
              <thead className="bg-[#2b193d] text-white">
                {waitingTable.getHeaderGroups().map((headerGroup) => (
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
                {waitingTable.getRowModel().rows.length > 0 ? (
                  waitingTable.getRowModel().rows.map((row) => (
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
                      colSpan={waitingTable.getAllColumns().length}
                      className="text-left border border-gray-600 p-2"
                    >
                      No courses waiting for approval
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {waitingTable.getRowModel().rows.length > 0 && (
              <div className="mt-2">
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

          {/*Pending feedbacks Section*/}
          <div className="bg-white p-8 text-black rounded-lg shadow-md w-full mb-10 overflow-auto">
            <h2 className="text-md mb-4">Courses with Pending Feedbacks</h2>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded mb-5"
              onClick={sendReminderAll}
            >
              Send Reminders
            </button>
            <table className="table-fixed min-w-full text-black border border-gray-600">
              <thead className="bg-[#2b193d] text-white">
                {pendingTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{
                          width:
                            header.column.columnDef.header === "CID"
                              ? "10px"
                              : header.getSize(),
                        }}
                        className="font-bold text-left border border-gray-600 p-2"
                      >
                        {header.column.columnDef.header}
                        {header.column.getCanSort() && (
                          <FaSort
                            onClick={header.column.getToggleSortingHandler()}
                            className="inline ml-1 cursor-pointer"
                          />
                        )}
                        {header.column.getCanFilter() && (
                          <div className="mt-2">
                            <CheckboxColumnFilter
                              column={header.column}
                              data={pendingFeedbacks}
                            />
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {pendingTable.getRowModel().rows.length > 0 ? (
                  pendingTable.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            width:
                              cell.column.columnDef.header === "CID"
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
                      colSpan={pendingTable.getAllColumns().length}
                      className="text-left border border-gray-600 p-2"
                    >
                      No pending feedbacks
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
