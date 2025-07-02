import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    axios
      .post(`https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/reset-password/${token}`, { newPassword })
      .then((response) => {
        console.log(response.data);
        navigate("/");
        alert("Password reset successfully.");
      })
      .catch((error) => {
        console.error("There was an error sending the email!", error);
      });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="h-auto w-full sm:w-[50rem] flex flex-col items-center justify-center space-y-6 sm:space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Reset Password</h2>
          
          <form onSubmit={handleChangePassword} className="space-y-4 w-full flex flex-col items-center">
            <div className="h-[3.6rem] w-[16.7rem] sm:h-[4.2rem] sm:w-[20.2rem] rounded-full flex items-center justify-center bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF]">
              <div className="h-[3.4rem] w-[16.5rem] sm:h-[4rem] sm:w-[20rem] rounded-full flex items-center justify-between px-4 bg-white">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-white focus:outline-none w-full text-black"
                />
              </div>
            </div>

            <div className="h-[3.6rem] w-[16.7rem] sm:h-[4.2rem] sm:w-[20.2rem] rounded-full flex items-center justify-center bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF]">
              <div className="h-[3.4rem] w-[16.5rem] sm:h-[4rem] sm:w-[20rem] rounded-full flex items-center justify-between px-4 bg-white">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white focus:outline-none w-full text-black"
                />
              </div>
            </div>

            {error && <div className="text-red-600 font-medium">{error}</div>}

            <button
              type="submit"
              className="h-10 w-48 sm:w-52 sm:h-14 border-2 rounded-full text-lg sm:text-xl bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] text-white font-semibold"
            >
              Change Password
            </button>
          </form>

      </div>
    </div>
  );
};

export default ResetPassword;