import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginInPage from "./pages/LoginInPage.jsx";
import ForgotPassword from "./pages/forgotpassword.jsx";
import ResetPassword from "./pages/resetPassword.jsx";
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
import SessionManager from "./components/sessionManager.jsx";
import PrivateRoute from "./components/privateRoute.jsx";

function App() {
  return (
    <>
      <SessionManager>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginInPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/roleselection" element={<PrivateRoute><RoleSelectionPage /></PrivateRoute>} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/faculty" element={<AdminFaculty />} />

        <Route path="/faculty/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/faculty/courses" element={<PrivateRoute><FacultyCourses /></PrivateRoute>} />
        <Route path="/faculty/newcourse" element={<PrivateRoute><NewCoursePage /></PrivateRoute>} />
        <Route path="/faculty/fileupload/:CID" element={<PrivateRoute><VideoUploadPage /></PrivateRoute>} />

        <Route path="/reviewer/home" element={<PrivateRoute><ReviewerHome /></PrivateRoute>} />
        <Route path="/reviewer/courses" element={<PrivateRoute><ReviewerCourses /></PrivateRoute>} />
        <Route path="/viewfile/:fileId" element={<PrivateRoute><ViewFile /></PrivateRoute>} />

      </Routes>
      <FacultyToastContainer />
      </SessionManager>
    </>
  );
}

export default App;
