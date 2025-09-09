import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/faculty/sidebar1";
import { FaChevronDown, FaBars, FaSort } from "react-icons/fa";
import Nav from "../../components/nav";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

const ReviewerCourses = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topics, setTopics] = useState([]);

  const email = localStorage.getItem("email");

  useEffect(() => {
    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/reviewer/courses-to-review`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses data!", error);
      });
  }, []);

  const getSelectedCourse = (CID) => {
    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/faculty/course/${CID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setSelectedCourse(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the selected course data!",
          error
        );
      });
  };

  const getCourseTopics = (CID) => {
    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/reviewer/topics-to-review/${CID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const courseColumns = [
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
    },
    {
      header: "Total Files",
      accessorKey: "total_files",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Pending Files",
      accessorKey: "files_without_feedback",
      cell: (props) => <p>{props.getValue()}</p>,
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
      header: "Actions",
      accessorKey: "actions",
      cell: (props) => (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {
            console.log("Action clicked for topic:", props.row.original);
          }}
        >
          <Link to={`/viewfile/${props.row.original.File_id}`}>
            View Review
          </Link>
        </button>
      ),
    },
  ];

  const pendingColumns = [
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
      header: "Deadline",
      accessorKey: "Uploaded_at",
      cell: (props) => (
        <p>
          {7 -
            Math.floor(
              (Date.now() - new Date(props.getValue())) / (1000 * 60 * 60 * 24)
            )}{" "}
          days left
        </p>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (props) => (
        <Link to={`/viewfile/${props.row.original.File_id}`}>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Review
          </button>
        </Link>
      ),
    },
  ];

  const courseTable = useReactTable({
    data: courses,
    columns: courseColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const topicsTable = useReactTable({
    data: topics.filter((topic) => topic.has_feedback === "Yes"),
    columns: topicsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pendingTable = useReactTable({
    data: topics.filter((topic) => topic.has_feedback === "No"),
    columns: pendingColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
          PageName={"Assigned Courses"}
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />

        <main className="p-10 pt-24 bg-gray-200 min-h-screen">
          <div className="mt-5 bg-white p-8 rounded-lg shadow-md w-full overflow-auto">
            <table
              style={{ width: courseTable.getCenterTotalSize() }}
              className="table-fixed min-w-full text-black border border-gray-600"
            >
              <thead className="bg-[#2b193d] text-white">
                {courseTable.getHeaderGroups().map((headerGroup) => (
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
                {courseTable.getRowModel().rows.length > 0 ? (
                  courseTable.getRowModel().rows.map((row) => (
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
                      colSpan={courseTable.getAllColumns().length}
                      className="text-left border border-gray-600 p-2"
                    >
                      Currently, you have no courses assigned.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {courseTable.getRowModel().rows.length > 0 && (
              <div className="mt-2 text-black">
                <p>
                  Page {courseTable.getState().pagination.pageIndex + 1} of{" "}
                  {courseTable.getPageCount()}
                </p>
                <button
                  className="border border-gray-600 text-sm p-1 mr-2"
                  onClick={() => courseTable.previousPage()}
                  disabled={!courseTable.getCanPreviousPage()}
                >
                  {"<"}
                </button>
                <button
                  className="border border-gray-600 text-sm p-1"
                  onClick={() => courseTable.nextPage()}
                  disabled={!courseTable.getCanNextPage()}
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
                        : selectedCourse.Reviewer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedCourse !== null && (
            <div className="bg-white mt-4 p-8 text-black rounded-lg shadow-md w-full overflow-auto">
  <h2 className="mb-6 text-black">
    Topics of "{selectedCourse.Course_name}"
  </h2>
  <table
    style={{ width: pendingTable.getCenterTotalSize() }}
    className="table-fixed min-w-full text-black border border-gray-600"
  >
    <thead className="bg-[#2b193d] text-white">
      {pendingTable.getHeaderGroups().map((headerGroup) => (
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
      {pendingTable.getRowModel().rows.length > 0 ? (
        pendingTable.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                style={{ width: cell.column.getSize() }}
                className="text-left border border-gray-600 p-2"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
            No topics pending review for this course.
          </td>
        </tr>
      )}
    </tbody>
  </table>

  {pendingTable.getRowModel().rows.length > 0 && (
    <div className="mt-2">
      <p>
        Page {pendingTable.getState().pagination.pageIndex + 1} of{" "}
        {pendingTable.getPageCount()}
      </p>
      <button
        className="border border-gray-600 text-sm p-1 mr-2"
        onClick={() => pendingTable.previousPage()}
        disabled={!pendingTable.getCanPreviousPage()}
      >
        {"<"}
      </button>
      <button
        className="border border-gray-600 text-sm p-1"
        onClick={() => pendingTable.nextPage()}
        disabled={!pendingTable.getCanNextPage()}
      >
        {">"}
      </button>
    </div>
  )}
</div>

          )}

          {selectedCourse !== null && (
            <div className="bg-white mt-4 p-8 text-black rounded-lg shadow-md w-full overflow-auto">
              <h2 className="mb-6 text-black">
                Topics of "{selectedCourse.Course_name}"
              </h2>
              <table
                style={{ width: topicsTable.getCenterTotalSize() }}
                className="table-fixed min-w-full text-black border border-gray-600"
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
                  {topicsTable.getRowModel().rows.length > 0 ? (
                    topicsTable.getRowModel().rows.map((row) => (
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
                        colSpan={topicsTable.getAllColumns().length}
                        className="text-left border border-gray-600 p-2"
                      >
                        Topics have not been uploaded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {topicsTable.getRowModel().rows.length > 0 && (
                <div className="mt-2">
                  <p>
                    Page {topicsTable.getState().pagination.pageIndex + 1} of{" "}
                    {topicsTable.getPageCount()}
                  </p>
                  <button
                    className="border border-gray-600 text-sm p-1 mr-2"
                    onClick={() => topicsTable.previousPage()}
                    disabled={!topicsTable.getCanPreviousPage()}
                  >
                    {"<"}
                  </button>
                  <button
                    className="border border-gray-600 text-sm p-1"
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

export default ReviewerCourses;
