import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import passwordIcon from "../assets/loginpage_passsword_icon.png";

const LoginInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/login", {
        email: username,
        password: password,
      })
      .then((response) => {
        const data = response.data;
        if (data.token) {
          localStorage.setItem("token", data.token);
          const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
          localStorage.setItem("email", decodedToken.Faculty_Email);
          localStorage.setItem("FID", decodedToken.FID);
          navigate("/roleselection");
        } else {
          alert("Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        console.error("There was an error logging in!", error);
      });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md flex flex-col items-center space-y-6 p-6">
        <div className="flex space-x-2 text-sm sm:text-base">
          <p className="text-black">Don't have an account?</p>
          <Link to="/signup" className="underline text-purple-700">Signup Now</Link>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6 flex flex-col items-center">
          {/* Username */}
          <div className="w-3/4 rounded-full flex items-center bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] p-1">
            <div className="w-full flex items-center justify-between px-4 py-2 bg-white rounded-full">
              <input
                type="text"
                placeholder="User Name"
                className="w-full focus:outline-none text-black bg-white"
                onChange={(e) => setUsername(e.target.value)}
              />
              <FaUser className="text-[#78F6F7] text-xl" />
            </div>
          </div>

          {/* Password */}
          <div className="w-3/4 rounded-full flex items-center bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] p-1">
            <div className="w-full flex items-center justify-between px-2 py-2 bg-white rounded-full">
              <input
                type="password"
                placeholder="Password"
                className="w-full focus:outline-none text-black bg-white"
                onChange={(e) => setPassword(e.target.value)}
              />
              <img src={passwordIcon} alt="Password Icon" className="h-6 w-6" />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-1/3 h-12 border-2 rounded-full text-lg bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] text-white font-semibold hover:scale-105 transition duration-300 ease-in-out"
          >
            Login
          </button>

          {/* Forgot Password */}
          <div className="text-black text-sm underline font-medium hover:text-[#B98389] transition duration-300 ease-in-out">
            <Link to="/forgotpassword">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginInPage;
