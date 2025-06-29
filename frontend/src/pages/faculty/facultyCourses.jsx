import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/faculty/sidebar1";
import { FaChevronDown, FaBars, FaSort } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";
import Nav from "../../components/nav";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { showFacultyToast } from "../../components/faculty/FacultyToast";

const FacultyCourses = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");
  useEffect(() => {
    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/faculty/courses/${localStorage.getItem(
          "FID"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses!", error);
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
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/faculty/get-topics/${CID}`, {
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

  const completeCourse = (CID) => {
    axios
      .post(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/faculty/complete-course/${CID}`,
        {
          status: "Completed"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log("Course completed:", response.data);
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.CID === CID ? { ...course, status: "Completed" } : course
          )
        );
        showFacultyToast("Course completed successfully", "success");
      })
      .catch((error) => {
        console.error("Error completing course:", error);
        showFacultyToast("Failed to complete course. Try again", "error");
      });
  }

  const columns = [
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
      size: 150,
    },
    {
      header: "Course Description",
      accessorKey: "Course_description",
      cell: (props) => <p>{props.getValue()}</p>,
      size: 250,
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (props) => <p>{new Date(props.getValue()).toLocaleDateString()}</p>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (props) => (
        <p
          className={`${
            props.getValue() == "Active" ? "text-green-700" : "text-red-700"
          } font-semibold`}
        >
          {props.getValue()}
        </p>
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
    {
      header: "Feedback",
      cell: (props) => (
        <Link to={`/viewfile/${props.row.original.File_id}`}>
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            View Feedback
          </button>
        </Link>
      ),
    },
  ];

  const topicsTable = useReactTable({
    data: topics,
    columns: topicsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const table = useReactTable({
    data: courses,
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
          <div className="mt-5 bg-white p-8 rounded-lg shadow-md w-auto overflow-auto">
            <h2>My Courses</h2>
            <table className="min-w-full text-black table-fixed">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="font-bold text-left text-white bg-[#2b193d] border border-gray-600 p-2"
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
                {table.getRowModel().rows.map((row) => (
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
                ))}
              </tbody>
            </table>

            <div className="mt-2 text-black">
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
                  <div>
                    {selectedCourse.status == "Active" ? (
                      <button
                        className="bg-[#2b193d] hover:bg-green-700 text-white p-2 w-1/2 rounded-lg"
                        onClick={() => {
                          completeCourse(selectedCourse.CID);
                        }}
                      >
                        Complete Course
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedCourse !== null && (
            <div className="bg-white mt-4 p-8 text-black rounded-lg text-center shadow-md w-full overflow-auto">
              <h2 className="mb-6 text-black">
                Topics of "{selectedCourse.Course_name}"
              </h2>
              {selectedCourse.status === "Active" && (
                <Link to={`/faculty/fileupload/${selectedCourse.CID}`}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4 flex items-center">
                    <GrAdd className="mr-2" />
                    Upload new Topics
                  </button>
                </Link>
              )}

              <table className="table-fixed min-w-full text-left border border-gray-600">
                <thead className="bg-[#2b193d] text-white">
                  {topicsTable.getHeaderGroups().map((headerGroup) => (
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
                  {topicsTable.getRowModel().rows.length > 0 ? (
                    topicsTable.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            style={{ width: cell.column.getSize() }}
                            className="border border-gray-600 p-2"
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
                        className="p-2"
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

export default FacultyCourses;
