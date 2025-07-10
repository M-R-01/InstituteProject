/** @format */

import React from "react";
import { useState, useEffect } from "react";

import Sidebar from "../../components/admin/sidebar2";
import CheckboxColumnFilter from "../../components/filterbox";

import axios from "axios";
import { FaBars, FaSort } from "react-icons/fa";

import { showFacultyToast } from "../../components/faculty/FacultyToast";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [availableReviewers, setAvailableReviewers] = useState([]);
  const [topics, setTopics] = useState([]);

  const [assignReviewer, setAssignReviewer] = useState(false);

  useEffect(() => {
    axios
      .get(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/courses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const getSelectedCourse = (CID) => {
    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/course/${CID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setSelectedCourse(response.data);
        console.log("Selected course:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching selected course:", error);
      });
  };

  const getCourseTopics = (CID) => {
    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/get-topics/${CID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setTopics(response.data);
        console.log("Course topics:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching course topics:", error);
      });
  };

  const getAvailableReviewers = () => {
    axios
      .get(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/available-reviewers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setAvailableReviewers(response.data);
        console.log("Available reviewers:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching available reviewers:", error);
      });
  };

  const assignReviewerToCourse = (reviewer, courseId) => {
    axios
      .post(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/assign-reviewers",
        {
          courseId: courseId,
          reviewer: reviewer,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setAssignReviewer(false);
        getSelectedCourse(selectedCourse.CID);
        showFacultyToast("Reviewer assigned successfully", "success");
      })
      .catch((error) => {
        console.error("Error assigning reviewer:", error);
        showFacultyToast("Error assigning reviewer", "error");
      });
  };

  const sendRequestReminder = (reviewer, courseName) => {
    axios
      .post(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/send-request-reminder",
        {
          courseName: courseName,
          reviewer: reviewer,
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

  const deleteReviewRequest = (reviewer, courseId) => {
    axios
      .delete(
        "https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin/delete-review-request",
        {
          data: {
            reviewer: reviewer,
            courseId: courseId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        showFacultyToast("Request Deleted Successfully", "success");
        getSelectedCourse(selectedCourse.CID);
      })
      .catch((err) => {
        console.error("Error deleting request:", err);
        showFacultyToast("Error deleting request", "error");
      });
  };

  const coursesColumns = [
    {
      header: "Course Name",
      accessorKey: "Course_name",
      cell: (props) => (
        <p
          className="cursor-pointer hover:underline"
          onClick={() => {
            getSelectedCourse(props.row.original.CID);
            getCourseTopics(props.row.original.CID);
          }}
        >
          {props.getValue()}
        </p>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "Faculty Name",
      accessorKey: "Faculty_Name",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "Faculty Qualification",
      accessorKey: "Faculty_Qualification",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "Faculty Department",
      accessorKey: "Faculty_department",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },

    {
      header: "Faculty Institution",
      accessorKey: "Faculty_Institution",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },

    {
      header: "Reviewer",
      accessorKey: "Reviewer",
      cell: (props) => (
        <>
          {props.row.original.Reviewer_Status == "accepted" ? (
            <p>{props.getValue()}</p>
          ) : (
            <p className="text-red-700">
              {props.getValue() == null
                ? "No reviewer assigned"
                : "Pending Reviewer Decision"}
            </p>
          )}
        </>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (props) => <p>{new Date(props.getValue()).toLocaleDateString()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
  ];

  const reviewersColumns = [
    {
      header: "Name",
      accessorKey: "Faculty_Name",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "Qualification",
      accessorKey: "Faculty_Qualification",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "Department",
      accessorKey: "Faculty_department",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "Institution",
      accessorKey: "Faculty_Institution",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "No. of Courses Assigned",
      accessorKey: "Number_of_Courses_Reviewing",
      cell: (props) => <p>{props.getValue()}</p>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      enableColumnFilter: true,
    },
    {
      header: "Assign Reviewer",
      cell: (props) => (
        <button
          className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-lg"
          onClick={() => {
            assignReviewerToCourse(props.row.original.FID, selectedCourse.CID);
          }}
        >
          Send Request
        </button>
      ),
    },
  ];

  const topicsColumns = [
    {
      header: "Topic Name",
      accessorKey: "File_name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "File Type",
      accessorKey: "File_type",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Uploaded At",
      accessorKey: "Uploaded_at",
      cell: (props) => <p>{new Date(props.getValue()).toLocaleDateString()}</p>,
    },
  ];

  const coursesTable = useReactTable({
    data: courses,
    columns: coursesColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const reviewersTable = useReactTable({
    data: availableReviewers,
    columns: reviewersColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const topicsTable = useReactTable({
    data: topics,
    columns: topicsColumns,
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
          <h1 className="text-xl font-bold text-black">Courses</h1>
        </nav>

        <main className="p-10 pt-24 bg-gray-200 min-h-screen">
          <div className="bg-white p-8 text-black rounded-lg shadow-md mt-5 w-full overflow-auto">
            <h2 className="mb-6 text-black text-center">All Courses</h2>

            <table
              style={{ width: coursesTable.getCenterTotalSize() }}
              className="table-fixed min-w-full border border-gray-600 text-black"
            >
              <thead className="bg-[#2b193d] text-white">
                {coursesTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="font-bold text-left border border-gray-600 p-2"
                      >
                        <div className="flex items-center">
                          {header.column.columnDef.header}
                          {header.column.getCanSort() && (
                            <FaSort
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline ml-1 cursor-pointer"
                            />
                          )}
                        </div>
                        {header.column.getCanFilter() && (
                          <div className="mt-2">
                            <CheckboxColumnFilter
                              column={header.column}
                              data={courses}
                            />
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {coursesTable.getRowModel().rows.length > 0 ? (
                  coursesTable.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="text-left border border-gray-600 p-2 break-words"
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
                      colSpan={coursesTable.getAllColumns().length}
                      className="text-left border border-gray-600 p-2"
                    >
                      No courses available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {coursesTable.getRowModel().rows.length > 0 && (
              <div className="mt-2 text-center">
                <p>
                  Page {coursesTable.getState().pagination.pageIndex + 1} of{" "}
                  {coursesTable.getPageCount()}
                </p>
                <button
                  className="border border-gray-600 text-sm p-2 m-1"
                  onClick={() => coursesTable.previousPage()}
                  disabled={!coursesTable.getCanPreviousPage()}
                >
                  {"<"}
                </button>
                <button
                  className="border border-gray-600 text-sm p-2 m-1"
                  onClick={() => coursesTable.nextPage()}
                  disabled={!coursesTable.getCanNextPage()}
                >
                  {">"}
                </button>
              </div>
            )}
          </div>

          {selectedCourse !== null && (
            <div className="bg-white mt-4 p-8 text-black rounded-lg shadow-md width-3xl mt-10">
              <div className="flex justify-content">
                <div className="flex flex-col w-1/2">
                  <div className="text-left mb-4">
                    <h2 className="text-black font-bold">Course Name</h2>
                    <h2 className="text-black">{selectedCourse.Course_name}</h2>
                  </div>
                  <div className="text-left mb-4">
                    <h2 className="text-black font-bold">Course Description</h2>
                    <p className="text-black">
                      {selectedCourse.Course_description}
                    </p>
                  </div>
                  <div className="text-left">
                    <h2 className="text-black font-bold">No. of resources</h2>
                    <p className="text-black">{selectedCourse.File_Count}</p>
                  </div>
                </div>
                <div className="flex flex-col w-1/2">
                  <div className="text-left mb-4">
                    <h2 className="text-black font-bold">Faculty Name</h2>
                    <p className="text-black">{selectedCourse.Faculty_Name}</p>
                  </div>
                  <div className="text-left mb-4">
                    <h2 className="text-black font-bold">Reviewer</h2>
                    <p className="text-black">
                      {selectedCourse.Reviewer == null
                        ? "No reviewer assigned"
                        : selectedCourse.Reviewer_Status == "pending"
                        ? `${selectedCourse.Reviewer} (pending decision)`
                        : selectedCourse.Reviewer}
                    </p>
                  </div>
                  <div>
                    {selectedCourse.Reviewer == null ? (
                      <button
                        className="bg-[#2b193d] hover:bg-green-700 text-white p-2 w-1/2 rounded-lg"
                        onClick={() => {
                          setAssignReviewer(!assignReviewer);
                          getAvailableReviewers();
                        }}
                      >
                        {assignReviewer ? "Close" : "Assign Reviewer"}
                      </button>
                    ) : (
                      ""
                    )}

                    {selectedCourse.Reviewer_Status == "pending" ? (
                      <div className="flex gap-2">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white p-2 w-1/3 rounded-lg"
                          onClick={() => {
                            deleteReviewRequest(
                              selectedCourse.Reviewer_Id,
                              selectedCourse.CID
                            );
                          }}
                        >
                          Delete Request
                        </button>
                        <button
                          className="bg-[#2b193d] hover:bg-green-700 text-white p-2 w-1/3 rounded-lg"
                          onClick={() => {
                            sendRequestReminder(
                              selectedCourse.Reviewer_Id,
                              selectedCourse.Course_name
                            );
                          }}
                        >
                          Send Reminder
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              {assignReviewer && (
                <div className="mt-4 text-center">
                  <h2 className="text-black text-left mb-2">
                    Available Reviewers
                  </h2>

                  <div className="overflow-auto">
                    <table
                      style={{ width: reviewersTable.getCenterTotalSize() }}
                      className="min-w-full table-fixed border border-gray-600"
                    >
                      <thead className="bg-[#2b193d] text-white">
                        {reviewersTable.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th
                                key={header.id}
                                style={{ width: header.getSize() }}
                                className="font-bold text-left border border-gray-600 p-2"
                              >
                                <div className="flex items-center">
                                  {header.column.columnDef.header}
                                  {header.column.getCanSort() && (
                                    <FaSort
                                      onClick={header.column.getToggleSortingHandler()}
                                      className="ml-1 cursor-pointer"
                                    />
                                  )}
                                </div>
                                {header.column.getCanFilter() && (
                                  <div className="mt-2">
                                    <CheckboxColumnFilter
                                      column={header.column}
                                      data={availableReviewers}
                                    />
                                  </div>
                                )}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>

                      <tbody>
                        {reviewersTable.getRowModel().rows.length > 0 ? (
                          reviewersTable.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                              {row.getVisibleCells().map((cell) => (
                                <td
                                  key={cell.id}
                                  style={{ width: cell.column.getSize() }}
                                  className="text-left border border-gray-600 p-2 break-words"
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
                              colSpan={reviewersTable.getAllColumns().length}
                              className="text-left border border-gray-600 p-2"
                            >
                              Reviewers Not Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {reviewersTable.getRowModel().rows.length > 0 && (
                    <div className="mt-2">
                      <p>
                        Page{" "}
                        {reviewersTable.getState().pagination.pageIndex + 1} of{" "}
                        {reviewersTable.getPageCount()}
                      </p>
                      <button
                        className="border border-gray-600 text-sm p-2 m-1"
                        onClick={() => reviewersTable.previousPage()}
                        disabled={!reviewersTable.getCanPreviousPage()}
                      >
                        {"<"}
                      </button>
                      <button
                        className="border border-gray-600 text-sm p-2 m-1"
                        onClick={() => reviewersTable.nextPage()}
                        disabled={!reviewersTable.getCanNextPage()}
                      >
                        {">"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedCourse !== null && (
            <div className="bg-white mt-4 p-8 text-black rounded-lg shadow-md w-full overflow-auto">
              <h2 className="mb-6 text-black text-center">
                Topics of "{selectedCourse.Course_name}"
              </h2>

              <table
                style={{ width: topicsTable.getCenterTotalSize() }}
                className="table-fixed min-w-full border border-gray-600 text-black"
              >
                <thead className="bg-[#2b193d] text-white">
                  {topicsTable.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          style={{ width: header.getSize() }}
                          className="font-bold text-left border border-gray-600 p-2"
                        >
                          <div className="flex items-center">
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
                  {topicsTable.getRowModel().rows.length > 0 ? (
                    topicsTable.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            style={{ width: cell.column.getSize() }}
                            className="text-left border border-gray-600 p-2 break-words"
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
                        colSpan={topicsTable.getAllColumns().length}
                        className="text-left border border-gray-600 p-2"
                      >
                        Topics have not been uploaded for this course yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {topicsTable.getRowModel().rows.length > 0 && (
                <div className="mt-2 text-center">
                  <p>
                    Page {topicsTable.getState().pagination.pageIndex + 1} of{" "}
                    {topicsTable.getPageCount()}
                  </p>
                  <button
                    className="border border-gray-600 text-sm p-2 m-1"
                    onClick={() => topicsTable.previousPage()}
                    disabled={!topicsTable.getCanPreviousPage()}
                  >
                    {"<"}
                  </button>
                  <button
                    className="border border-gray-600 text-sm p-2 m-1"
                    onClick={() => topicsTable.nextPage()}
                    disabled={!topicsTable.getCanNextPage()}
                  >
                    {">"}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminCourses;
