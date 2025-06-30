import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginInPage from "./pages/LoginInPage.jsx";
import ForgotPassword from "./pages/forgotpassword.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import RoleSelectionPage from "./pages/RoleSelectionPage.jsx";

import ViewFile from "./pages/viewFile.jsx";

import AdminLogin from "./pages/admin/adminLogin.jsx";
import AdminHome from "./pages/admin/adminHome.jsx";
import AdminCourses from "./pages/admin/adminCourses.jsx";
import AdminFaculty from "./pages/admin/adminFaculty.jsx";

import HomePage from "./pages/faculty/facultyHome.jsx";
import FacultyCourses from "./pages/faculty/facultyCourses.jsx";
import NewCoursePage from "./pages/faculty/NewCoursePage.jsx";
import VideoUploadPage from "./pages/faculty/fileupload.jsx";

import ReviewerHome from "./pages/reviewer/reviewerHome.jsx";
import ReviewerCourses from "./pages/reviewer/reviewerCourses.jsx";

import { FacultyToastContainer } from "./components/faculty/FacultyToast.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginInPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/roleselection" element={<RoleSelectionPage />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/faculty" element={<AdminFaculty />} />

        <Route path="/faculty/home" element={<HomePage />} />
        <Route path="/faculty/courses" element={<FacultyCourses />} />
        <Route path="/faculty/newcourse" element={<NewCoursePage />} />
        <Route path="/faculty/fileupload/:CID" element={<VideoUploadPage />} />

        <Route path="/reviewer/home" element={<ReviewerHome />} />
        <Route path="/reviewer/courses" element={<ReviewerCourses />} />
        <Route path="/viewfile/:fileId" element={<ViewFile />} />

      </Routes>
      <FacultyToastContainer />
    </>
  );
}

export default App;
