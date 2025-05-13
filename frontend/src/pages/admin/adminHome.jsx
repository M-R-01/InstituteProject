/** @format */

import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/sidebar2";
import { FaBars } from "react-icons/fa";

const AdminHome = () => {
  return (
    <>
      <Sidebar />
      <nav className="fixed top-0 left-0 w-full md:w-[calc(100%-16rem)] md:ml-64 bg-white shadow-md p-4 flex justify-between items-center z-10">
        <button
          className="md:hidden text-2xl text-black"
          onClick={() => setSidebarToggle(!sidebarToggle)}
        >
          <FaBars />
        </button>
        <h1 className="text-xl font-bold text-black">Home</h1>
      </nav>
    </>
  );
};

export default AdminHome;
