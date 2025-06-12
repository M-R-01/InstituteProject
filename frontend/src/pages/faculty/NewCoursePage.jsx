import React from "react";
import { useState } from "react";
import Logo1 from "../../assets/courselaptopimage.png";
import Logo2 from "../../assets/courseimagemobile.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewCoursePage() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    axios
      .post(
        "https://instituteproject.up.railway.app/faculty/submit-for-approval",
        {
          courseName: courseName,
          courseDescription: courseDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        alert("Course submitted for approval successfully!");
        navigate("/faculty/home");
      })
      .catch((error) => {
        console.error("There was an error submitting the course!", error);
        alert("Failed to submit course. Please try again.");
      });
  };

  const handleCourseName = (e) => {
    setCourseName(e.target.value);
  };

  const handleCourseDescription = (e) => {
    setCourseDescription(e.target.value);
  };
  return (
    <main className="h-screen w-full bg-white flex items-center justify-center">
      <div className="sm:h-3/4 h-[40rem] w-full sm:w-3/4 sm:flex sm:flex-row sm:items-center sm:justify-center flex flex-col items-center justify-center">
        {/* left side */}
        <div className="sm:h-full h-[12rem] w-full sm:w-2/5 flex flex-col items-center justify-center space-y-4 ">
          <div className="sm:text-[2.5rem] text-[1.5rem] text-[#2B193D] font-bold">
            Choose your
          </div>
          <div className="sm:h-[25rem] h-[5.5rem] w-full sm:w-[14rem]">
            <img
              src={Logo2}
              alt="Mobile View"
              className="block md:hidden h-[5.5rem] w-full px-[2.5rem]"
            />
            <img
              src={Logo1}
              alt="Laptop View"
              className="hidden md:block h-[25rem] w-[14rem]"
            />
          </div>
        </div>
        {/* Right Side */}
        <div className="sm:h-full h-[28rem] w-full sm:w-3/5 ">
          {/* Course Name */}
          <div className="sm:h-[3.5rem] w-2/3 sm:w-4/5 mx-auto mt-5 p-2">
            <h2 className="text-[#2B193D] text-xl font-bold">Course name-</h2>
            <div className="h-[2rem] w-full border-b-2">
              <input
                type="text"
                className="bg-white focus:outline-none text-[#B98389] text-[1.2rem] w-full"
                onChange={handleCourseName}
                value={courseName}
              />
            </div>
          </div>
          {/* Course Description */}
          <div className=" w-2/3 sm:w-4/5 mx-auto mt-5 p-2">
            <h2 className="text-[#2B193D] text-xl font-bold">
              Course Description-
            </h2>
            <div className="h-[7rem] w-full border-b-2 mt-4">
              <textarea
                type="text"
                className="bg-white border-2 p-1 border-black rounded-xl focus:outline-none text-[#B98389] text-[1.2rem] h-[6.5rem] w-full sm:w-[30rem]"
                onChange={handleCourseDescription}
                value={courseDescription}
              />
            </div>
          </div>
          {/* Submit Button */}
          <div className="h-[4.5rem] w-full mt-[4.5rem] flex items-center justify-center">
            <button
              onClick={handleSubmit}
              className="h-[4rem] w-[14rem] font-semibold rounded-full bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] text-[1.2rem] p-1"
            >
              Submit for approval
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NewCoursePage;
