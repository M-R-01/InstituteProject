import React from "react";
import teacher from '../assets/faculty.png'
import student from '../assets/student.png'
import { useNavigate } from "react-router-dom";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleFacultyClick = () => {
    localStorage.setItem("role", "faculty");
    navigate(`/faculty/home`);
  };

  const handleReviewerClick = () => {
    localStorage.setItem("role", "reviewer");
    navigate(`/reviewer/home`);
  }

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 py-6">
        <div className="w-full max-w-5xl flex flex-col items-center justify-center space-y-6">
          <div className="text-2xl sm:text-3xl text-black font-semibold">Login as a-</div>
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-6 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r-2 border-dotted pb-4 sm:pb-0">
              <div className="font-bold text-xl sm:text-2xl underline text-[#B98389]">Faculty</div>
              <div className="w-32 sm:w-60">
                <img
                  className="w-full h-auto cursor-pointer transition-transform hover:scale-105"
                  src={teacher}
                  alt="faculty"
                  onClick={handleFacultyClick}
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-6 w-full sm:w-1/2">
              <div className="font-bold text-xl sm:text-2xl underline text-[#B98389]">Reviewer</div>
              <div className="w-32 sm:w-60">
                <img
                  className="w-full h-auto cursor-pointer transition-transform hover:scale-105"
                  src={student}
                  alt='reviewer'
                  onClick={handleReviewerClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoleSelectionPage;
