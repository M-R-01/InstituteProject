import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = () => {
    if (password === "Admin@123") {
        navigate('/admin/home');
    } else {
        alert("Invalid Password");
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="h-[30rem] w-full sm:h-[30rem] sm:w-[50rem] flex flex-col items-center justify-center space-y-2 sm:space-y-4">
        
        <div className="h-[3.6rem] w-[16.7rem] sm:h-[4.2rem] sm:w-[20.2rem] rounded-full flex items-center justify-center bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF]">
          <div className="h-[3.4rem] w-[16.5rem] sm:h-[4rem] sm:w-[20rem] rounded-full flex items-center justify-center text-lg sm:text-xl space-x-5 bg-white">
            <input
              type="password"
              className="border-none focus:border-none bg-white text-black"
              placeholder="Password"
              onChange={(e)=>{setPassword(e.target.value)}}
            />
          </div>
        </div>
        <div>
          <button
            onClick={handleLogin}
            href="/"
            className="h-10 w-28 sm:w-32 sm:h-14 border-2 rounded-full text-lg sm:text-xl bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF]"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
