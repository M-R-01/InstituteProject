import React from "react";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import passwordIcon from "../assets/loginpage_passsword_icon.png"


const LoginInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    axios.post("https://instituteproject.up.railway.app/login", {
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

  const setusername = (e) => {
    setUsername(e.target.value);
  };

  const setpassword = (e) => {
    setPassword(e.target.value);
  };

  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
    <div className="w-full max-w-md flex flex-col items-center justify-center space-y-3 sm:space-y-4 border-2 p-6 rounded-xl shadow-md">
      <div className="flex space-x-1 sm:space-x-3 text-sm sm:text-base">
        <div className="text-black">Don't have an account?</div>
        <a href="/" className="underline text-purple-700">Signup Now</a>
      </div>

      <div className="w-3/4 rounded-full flex items-center justify-center bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] p-1">
        <div className="w-full rounded-full flex items-center justify-between px-4 py-2 bg-white">
          <input
            type="text"
            className="w-full focus:outline-none bg-white text-black placeholder:text-gray-500"
            placeholder="User Name"
            onChange={setusername}
          />
          <FaUser className="text-[#78F6F7] text-xl" />
        </div>
      </div>

      <div className="w-3/4 rounded-full flex items-center justify-center bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] p-1">
        <div className="w-full rounded-full flex items-center justify-between px-4 py-2 bg-white">
          <input
            type="password"
            className="w-full focus:outline-none bg-white text-black placeholder:text-gray-500"
            placeholder="Password"
            onChange={setpassword}
          />
          <img className="h-6 w-6" src={passwordIcon} alt="Password Icon" />
        </div>
      </div>

      <div className="w-2/5">
        <button
          onClick={handleSubmit}
          className="w-full h-12 sm:h-14 border-2 rounded-full text-lg sm:text-xl bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] text-white"
        >
          Login
        </button>
      </div>

      <div className="text-black text-base sm:text-lg underline font-semibold">
        <a href="/">Forgot Password</a>
      </div>
    </div>
  </div>
);
;
}

export default LoginInPage;
