  /** @format */

  import React from "react";
  import { useState, useEffect } from "react";
  import Sidebar from "../../components/admin/sidebar2";
  import { FaBars, FaSort } from "react-icons/fa";
  import axios from "axios";

  import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender
  } from "@tanstack/react-table";

  const AdminHome = () => {
    const [sidebarToggle, setSidebarToggle] = useState(false);
    const [courseCount, setCourseCount] = useState(0);
    const [facultyCount, setFacultyCount] = useState(0);
    const [resourceCount, setResourceCount] = useState(0);
    const [avgResourcesPerCourse, setAvgResourcesPerCourse] = useState(0);

    const [waitingCourses, setWaitingCourses] = useState([]);

    const handleApprove = (row) => {
      axios.post("https://instituteproject.up.railway.app/admin/approve-waiting-courses", {
        courseName: row.Course_name,
        courseDescription: row.Course_description,
        status: "approved",
      })
      .then((response) => {
        console.log("Course approved:", response.data);
      })
    };

    const handleReject = (row) => {
      console.log("Reject clicked for:", row);
      // Add your logic for rejecting the course
    };

    const columns = [
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
        cell: (row) =>
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
          ,
      },
    ];
    

    const table = useReactTable({
      data: waitingCourses,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    useEffect(() => {
      axios
        .get("https://instituteproject.up.railway.app/admin/metrics")
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
        .get("https://instituteproject.up.railway.app/admin/get-waiting-courses")
        .then((response) => {
          setWaitingCourses(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);

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
            <h1 className="text-xl font-bold text-black">Home</h1>
          </nav>

          <main className="p-10 pt-24 bg-gray-200 min-h-screen overflow-y-scroll overflow-x-scroll">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
              <div className="text-black space-y-3 text-left">
                <p>
                  <strong>No. of Courses</strong> - {courseCount}
                </p>
                <p>
                  <strong>No. of Faculty</strong> - {facultyCount}
                </p>
                <p>
                  <strong>No. of Resources</strong> - {resourceCount}
                </p>
                <p>
                  <strong>Avg. Resources per Course</strong> - {avgResourcesPerCourse}
                </p>
              </div>
            </div>

            <div  className="bg-white p-8 text-black rounded-lg text-center shadow-md max-w-auto  mt-5">
              <h2>Courses Waiting For Approval</h2>
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

  export default AdminHome;
