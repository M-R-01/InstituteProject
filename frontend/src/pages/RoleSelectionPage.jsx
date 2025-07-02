import React from "react";
import teacher from "../assets/faculty.png";
import student from "../assets/student.png";
import { useNavigate } from "react-router-dom";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleFacultyClick = () => {
    localStorage.setItem("role", "faculty");
    navigate("/faculty/home");
  };

  const handleReviewerClick = () => {
    localStorage.setItem("role", "reviewer");
    navigate("/reviewer/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-5xl flex flex-col items-center space-y-10">
        <h1 className="text-3xl font-semibold text-black">Login as a</h1>

        <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-10 sm:gap-16">
          {/* Faculty Card */}
          <div className="flex flex-col items-center space-y-4 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-gray-300 pb-6 sm:pb-0">
            <p className="text-xl sm:text-2xl font-bold underline text-[#B98389]">Faculty</p>
            <img
              src={teacher}
              alt="Faculty"
              className="w-full sm:w-60 cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={handleFacultyClick}
            />
          </div>

          {/* Reviewer Card */}
          <div className="flex flex-col items-center space-y-4 w-full sm:w-1/2">
            <p className="text-xl sm:text-2xl font-bold underline text-[#B98389]">Reviewer</p>
            <img
              src={student}
              alt="Reviewer"
              className="w-full sm:w-60 cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={handleReviewerClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
