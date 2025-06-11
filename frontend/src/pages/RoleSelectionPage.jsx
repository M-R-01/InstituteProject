import React from "react";
import teacher from '../assets/faculty.png'
import student from '../assets/student.png'
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
  }

  return (
    <>
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="sm:h-[35rem] sm:w-2/3 flex flex-col items-center justify-center sm:space-y-4">
          <div className="text-xl sm:text-2xl text-black">Login as a-</div>
          <div className="h-[31rem] w-full sm:h-[25rem] sm:w-4/5 mx-auto flex sm:flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-center ">
            <div className="h-[14rem] w-full sm:h-full sm:w-1/2 flex flex-col items-center justify-center space-y-2 sm:space-y-4 sm:border-r-2 sm:border-dotted">
                <div className="font-bold text-xl sm:text-2xl underline text-[#B98389]">Faculty</div>
                <div className="h-[12rem] w-[8rem] sm:h-[20rem] sm:w-[15rem] ">
                    <img className="h-[12rem] w-[8rem] sm:h-[20rem] sm:w-[15rem] " src={teacher} alt="faculty" onClick={handleFacultyClick}/>
                </div>
            </div>
            <div className="h-[14rem] w-full sm:h-full sm:w-1/2 flex flex-col items-center justify-center sm:space-y-4 ">
                <div className="font-bold text-xl sm:text-2xl underline text-[#B98389]">Reviewer</div>
                <div className="h-[12rem] w-[8rem] sm:h-[20rem] sm:w-[15rem] ">
                    <img className="h-[12rem] w-[8rem] sm:h-[20rem] sm:w-[15rem] " src={student} alt='reviewer' onClick={handleReviewerClick}/>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoleSelectionPage;
