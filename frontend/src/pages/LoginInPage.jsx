import React from "react";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";


const LoginInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const handleSubmit = (e) => {
    axios.post("https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/login", {
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
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="h-[30rem] w-full sm:h-[30rem] sm:w-[50rem] flex flex-col items-center justify-center space-y-2 sm:space-y-4">
        <div className="flex space-x-3 text-md sm:text-lg">
          <div className="text-black">Don't have an account?</div>
          <Link to="/signup" className="underline text-purple-700">
            Signup Now
          </Link>
        </div>
        <div className="h-[3.6rem] w-[16.7rem] sm:h-[4.2rem] sm:w-[20.2rem] rounded-full flex items-center justify-center bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF]">
          <div className="h-[3.4rem] w-[16.5rem] sm:h-[4rem] sm:w-[20rem] rounded-full flex items-center justify-center text-lg sm:text-xl space-x-2 sm:space-x-5 bg-white">
            <input
              type="text"
              className="focus:outline-none bg-white text-black"
              placeholder="User Name"
              onChange={setusername}
            />
            <FaUser className="text-[#78F6F7] text-2xl" />
          </div>
        </div>
        <div className="h-[3.6rem] w-[16.7rem] sm:h-[4.2rem] sm:w-[20.2rem] rounded-full flex items-center justify-center bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF]">
          <div className="h-[3.4rem] w-[16.5rem] sm:h-[4rem] sm:w-[20rem] rounded-full flex items-center justify-center text-lg sm:text-xl space-x-5 bg-white">
            <input
              type="password"
              className="focus:outline-none bg-white text-black"
              placeholder="Password"
              onChange={setpassword}
            />
            <img className="h-8 w-8" src="https://s3-alpha-sig.figma.com/img/d95c/106a/bfb0b07bc09a0712b97c2ad89b78829e?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=k4OMkXsMCDEbTFhBDF0pMnbrN~OgarrNKOJgwERoQfT4mwMOLkRfU-XMSi5LkAXIwBrl~9IED~tu02u7vYohBj-G9Zez7EyRHyvaUOr95QkTx-TjVLOZMfZk4w3wwn8erqErFRijC0EQsCQh1iIXjSKP7jxh3XsQUiTdeGGPqlKJ4LD9c3~BtqmBWXRk3CpKudTdv2j9QG61FvVx-QeYASJBwo84xdGjLNjKQ7G1vatgGsrpGnmCcM13wUeT9SvnzLvrsJU4yQBO1KTcR~1igYJ7m-wTTPCz2xn7wsF8bfPLyXUat60lYJthB17AjLR-09A5leg5Bljj7clZcXFWSg__"/>
          </div>
        </div>
        <div>
          <button
            onClick={handleSubmit}
            href="/"
            className="h-10 w-28 sm:w-32 sm:h-14 border-2 rounded-full text-lg sm:text-xl bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF]"
          >
            Login
          </button>
        </div>
        <div className="text-black text-xl sm:text-2xl underline font-semibold">
          <a href="/">Forgot Password</a>
        </div>
      </div>
    </div>
  );
}

export default LoginInPage;
