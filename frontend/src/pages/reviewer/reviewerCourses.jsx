import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const navigate = useNavigate();

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
      header: "File Link",
      accessorKey: "File_link",
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
      header: "File Link",
      accessorKey: "File_link",
      cell: (props) => <p className="">{props.getValue()}</p>,
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
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {
            console.log("Action clicked for pending topic:", props.row.original);
            navigate(`/viewfile/${props.row.original.File_id}`);
          }}
        >
          Review
        </button>
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
        <Nav PageName={"Assigned Courses"} />

        <main className="p-10 pt-24 bg-gray-200 min-h-screen">
          <div className="mt-5 bg-white p-8 rounded-lg shadow-md max-w-3xl">
            <h2>My Courses</h2>
            <div
              style={{ width: courseTable.getCenterTotalSize() }}
              className="text-black"
            >
              {courseTable.getRowModel().rows.length > 0 ? (
                <>
                  {courseTable.getHeaderGroups().map((headerGroup) => (
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
                  {courseTable.getRowModel().rows.map((row) => (
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
                    Page {courseTable.getState().pagination.pageIndex + 1} of{" "}
                    {courseTable.getPageCount()}
                  </p>
                  <button
                    className="border border-gray-600 text-15"
                    onClick={courseTable.getState().pagination.previousPage}
                  >
                    {"<"}
                  </button>
                  <button
                    className="border border-gray-600 text-15"
                    onClick={courseTable.getState().pagination.nextPage}
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
            <div className="bg-white mt-4 p-8 text-black rounded-lg text-center shadow-md max-w-auto">
              <h2 className="mb-6 text-black">
                Topics of "{selectedCourse.Course_name}"
              </h2>
              <div style={{ width: pendingTable.getCenterTotalSize() }}>
                {pendingTable.getRowModel().rows.length > 0 ? (
                  <>
                    {pendingTable.getHeaderGroups().map((headerGroup) => (
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
                    {pendingTable.getRowModel().rows.map((row) => (
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
                      Page {pendingTable.getState().pagination.pageIndex + 1} of{" "}
                      {pendingTable.getPageCount()}
                    </p>
                    <button
                      className="border border-gray-600 text-15"
                      onClick={pendingTable.getState().pagination.previousPage}
                    >
                      {"<"}
                    </button>
                    <button
                      className="border border-gray-600 text-15"
                      onClick={pendingTable.getState().pagination.nextPage}
                    >
                      {">"}
                    </button>
                  </>
                ) : (
                  <div className="flex">
                    <div className="flex-1 text-left p-2">
                      Topics have not been uploaded yet
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedCourse !== null && (
            <div className="bg-white mt-4 p-8 text-black rounded-lg text-center shadow-md max-w-auto">
              <h2 className="mb-6 text-black">
                Topics of "{selectedCourse.Course_name}"
              </h2>
              <div style={{ width: topicsTable.getCenterTotalSize() }}>
                {topicsTable.getRowModel().rows.length > 0 ? (
                  <>
                    {topicsTable.getHeaderGroups().map((headerGroup) => (
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
                    {topicsTable.getRowModel().rows.map((row) => (
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
                      Page {topicsTable.getState().pagination.pageIndex + 1} of{" "}
                      {topicsTable.getPageCount()}
                    </p>
                    <button
                      className="border border-gray-600 text-15"
                      onClick={topicsTable.getState().pagination.previousPage}
                    >
                      {"<"}
                    </button>
                    <button
                      className="border border-gray-600 text-15"
                      onClick={topicsTable.getState().pagination.nextPage}
                    >
                      {">"}
                    </button>
                  </>
                ) : (
                  <div className="flex">
                    <div className="flex-1 text-left p-2">
                      Topics have not been uploaded yet
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReviewerCourses;
