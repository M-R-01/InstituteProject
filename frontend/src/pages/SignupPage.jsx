import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import signupImage from "../assets/signup_page_image.png";

const SignupPage = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [college, setcollege] = useState("");
  const [qualification, setqualification] = useState("");
  const [department, setdepartment] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!name || !email || !college || !qualification || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    axios
      .post("https://instituteproject.up.railway.app/register", {
        name,
        email,
        password,
        institution: college,
        qualification,
        department,
      })
      .then((response) => {
        if (response.data.message) {
          setShowTerms(true);
        } else {
          alert("Signup failed. Please try again.");
        }
      });
  };

  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* left side */}
        <div className="w-full sm:w-2/5 flex flex-col items-center justify-center sm:border-[#939393] sm:border-r-2 sm:border-dotted mb-6 sm:mb-0">
          <div className="text-[#2B193D] text-3xl sm:text-5xl font-bold text-center">
            Welcome!!
          </div>
          <div className="mt-4 w-3/4 max-w-xs">
            <img
              className="w-full h-auto"
              src={signupImage}
              alt="signup_page_image"
            />
          </div>
        </div>

        {/* right side */}
        <div className="w-full sm:w-3/5 space-y-6">
          {/* Name */}
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-[#2B193D] text-lg sm:text-xl font-bold">Name-</h2>
            <div className="h-8 w-full border-b-2">
              <input
                type="text"
                onChange={(e) => setname(e.target.value)}
                value={name}
                placeholder="John Doe"
                className="bg-white w-full focus:outline-none text-[#B98389] text-lg"
              />
            </div>
          </div>

          {/* Email */}
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-[#2B193D] text-lg sm:text-xl font-bold">Email-</h2>
            <div className="h-8 w-full border-b-2">
              <input
                type="email"
                onChange={(e) => setemail(e.target.value)}
                value={email}
                placeholder="johndoe@27"
                className="bg-white w-full focus:outline-none text-[#B98389] text-lg"
              />
            </div>
          </div>

          {/* College */}
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-[#2B193D] text-lg sm:text-xl font-bold">College Name-</h2>
            <div className="h-8 w-full border-b-2">
              <input
                type="text"
                onChange={(e) => setcollege(e.target.value)}
                value={college}
                placeholder="National Institute of Technology"
                className="bg-white w-full focus:outline-none text-[#B98389] text-lg"
              />
            </div>
          </div>

          {/* Qualification */}
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-[#2B193D] text-lg sm:text-xl font-bold">Qualification-</h2>
            <div className="h-8 w-full border-b-2">
              <input
                type="text"
                onChange={(e) => setqualification(e.target.value)}
                value={qualification}
                placeholder="B.Tech, M.Tech Biotechnology"
                className="bg-white w-full focus:outline-none text-[#B98389] text-lg"
              />
            </div>
          </div>

          {/* Department */}
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-[#2B193D] text-lg sm:text-xl font-bold">Department-</h2>
            <div className="h-8 w-full border-b-2">
              <input
                type="text"
                onChange={(e) => setdepartment(e.target.value)}
                value={department}
                placeholder="CSE"
                className="bg-white w-full focus:outline-none text-[#B98389] text-lg"
              />
            </div>
          </div>

          {/* Password */}
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-[#2B193D] text-lg sm:text-xl font-bold">Set Password-</h2>
            <div className="h-8 w-full border-b-2">
              <input
                type="password"
                onChange={(e) => setpassword(e.target.value)}
                value={password}
                className="bg-white w-full focus:outline-none text-[#B98389] text-lg"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-[#2B193D] text-lg sm:text-xl font-bold">Confirm Password-</h2>
            <div className="h-8 w-full border-b-2">
              <input
                type="password"
                onChange={(e) => setconfirmPassword(e.target.value)}
                value={confirmPassword}
                className="bg-white w-full focus:outline-none text-[#B98389] text-lg"
              />
            </div>
          </div>

          {/* Signup Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="py-3 px-6 text-white bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] border-none rounded-full font-bold text-lg"
            >
              Complete
            </button>
          </div>

          {/* Terms Modal */}
          {showTerms && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Terms and Conditions
                </h3>
                <p className="mb-4 text-gray-700">
                  By signing up, you agree to our <div>Terms and Conditions</div>.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowTerms(false)}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowTerms(false);
                      navigate("/login");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    I Agree
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
