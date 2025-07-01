import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/forgot-password", { email })
      .then((response) => {
        console.log(response.data);
        alert("If your account exists, you will receive an email to reset your password.");
      })
      .catch((error) => {
        console.error("There was an error sending the email!", error);
      });
  };


  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="h-auto w-full sm:w-[50rem] flex flex-col items-center justify-center space-y-6 sm:space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Forgot Password</h2>

          <form onSubmit={handleEmailSubmit} className="space-y-6 flex flex-col items-center">
            <div className="h-[3.6rem] w-[16.7rem] sm:h-[4.2rem] sm:w-[20.2rem] rounded-full flex items-center justify-center bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF]">
              <div className="h-[3.4rem] w-[16.5rem] sm:h-[4rem] sm:w-[20rem] rounded-full flex items-center justify-between px-4 bg-white">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white focus:outline-none w-full text-black"
                />
                <svg
                  className="h-6 w-6 text-[#78F6F7]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 12h2a2 2 0 0 0 2-2V8m-4 4V8a4 4 0 0 0-8 0v4m-2 0h12m-6 4v4" />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className="h-10 w-28 sm:w-32 sm:h-14 border-2 rounded-full text-lg sm:text-xl bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] text-white font-semibold"
            >
              Submit
            </button>
          </form>


        <div className="text-black text-lg sm:text-xl underline font-medium">
          <Link to="/">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;