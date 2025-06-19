import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [college, setcollege] = useState("");
  const [qualification, setqualification] = useState("");
  const [department, setdepartment] = useState("");

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

    console.log(name, email, password, college, qualification, department);

    axios.post("https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/register", {
      name: name,
      email: email,
      password: password,
      institution: college,
      qualification: qualification,
      department: department
    })
    .then((response) => {
      if (response.data.message) {
        setShowTerms(true);
      } else {
        alert("Signup failed. Please try again.");
      }
    })
  }

  const handleNameChange = (e) => {
    setname(e.target.value);
  };

  const handleEmailChange = (e) => {
    setemail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setpassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setconfirmPassword(e.target.value);
  };

  const handleCollegeChange = (e) => {
    setcollege(e.target.value);
  };

  const handleQualificationChange = (e) => {
    setqualification(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setdepartment(e.target.value);
  };

  const [showTerms, setShowTerms] = useState(false);


  return (
    <main className="h-screen w-full bg-white flex items-center justify-center">
      <div className="sm:h-3/4 sm:w-3/4 h-[45rem] w-full flex sm:flex-row flex-col items-center justify-center">
        {/* left side */}
        <div className="sm:h-full sm:w-2/5 h-[15rem] w-full flex flex-col items-center justify-center sm:border-[#939393] sm:border-r-2 sm:border-dotted">
          <div className="text-[#2B193D] text-[2.8rem] sm:text-[3.5rem] font-bold">
            Welcome!!
          </div>
          <div className="sm:h-[13rem] sm:w-[20rem] h-[10rem] w-[17rem]">
            <img
              className="sm:h-[13rem] sm:w-[20rem] h-[10rem] w-[17rem]"
              src="https://s3-alpha-sig.figma.com/img/fcfc/ff17/6ef306299b98e89e5bc9204257efb079?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=D8-C6DcJPldufcRDuZycb1XHML5o0UOoD4uzZJfzngn1I04~lRgSZ35wLQkB6NMxaDMa2YxeyDlpvoWVpT-3nBdsxYaAU06sX5vb6wMgS6ZPhBgQcsb2BuMJxQw1z6mylgvL-0tqBi2040lZ8~G5lprWKf6Y7uf0dXWgaNVud~ss8syisNBWUdByUzhoODOCJM-EIgJ1waWpXClpRpddTCTKW3eUhwmeZanrRYhqc299~W-1xW4~NW16a72DfsZnhHm3xBYamRGV~rUKt3QEfhscYy9Rl-mQ1hEKlW9TdpvsZK2~qcfkYT5VyZ3KtyKi9HXKPPEgGhBIpkGMGdTNuQ__"
              alt=""
            />
          </div>
        </div>

        {/* right side */}
        <div className="sm:h-full sm:w-3/5 h-[30rem] w-full">
          {/* Signup form */}
          <div className="sm:pt-5">
            {/* Name */}
            <div className="sm:h-[3.5rem] sm:w-4/5 h-[2.8rem] w-2/3 mx-auto">
              <h2 className="text-[#2B193D] text-xl font-bold">Name-</h2>
              <div className="h-[2rem] w-full border-b-2">
                <input
                  type="text"
                  onChange={handleNameChange}
                  value={name}
                  placeholder="John Doe"
                  className="bg-white w-full focus:outline-none text-[#B98389] text-[1.2rem]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="sm:h-[3.5rem] sm:w-4/5 h-[2.8rem] w-2/3 mx-auto sm:mt-5 mt-6">
              <h2 className="text-[#2B193D] text-xl font-bold">Email-</h2>
              <div className="h-[2rem] w-full border-b-2">
                <input
                  type="email"
                  onChange={handleEmailChange}
                  value={email}
                  placeholder="johndoe@27"
                  className="bg-white focus:outline-none text-[#B98389] text-[1.2rem] w-full"
                />
              </div>
            </div>

            {/* College Name */}
            <div className="sm:h-[3.5rem] sm:w-4/5 h-[2.8rem] w-2/3 mx-auto sm:mt-5 mt-6">
              <h2 className="text-[#2B193D] text-xl font-bold">
                College Name-
              </h2>
              <div className="h-[2rem] w-full border-b-2">
                <input
                  type="text"
                  onChange={handleCollegeChange}
                  value={college}
                  placeholder="National Institute of Technology"
                  className="bg-white focus:outline-none text-[#B98389] text-[1.2rem] w-full"
                />
              </div>
            </div>

            {/*  Qualification */}
            <div className="sm:h-[3.5rem] sm:w-4/5 h-[2.8rem] w-2/3 mx-auto sm:mt-5 mt-6 ">
              <h2 className="text-[#2B193D] text-xl font-bold">
                Qualification-
              </h2>
              <div className="h-[2rem] w-full border-b-2">
                <input
                  type="text"
                  onChange={handleQualificationChange}
                  value={qualification}
                  placeholder="B.Tech, M.Tech Biotechnology"
                  className="bg-white focus:outline-none text-[#B98389] text-[1.2rem] w-full"
                />
              </div>
            </div>

            {/* Department */}
            <div className="sm:h-[3.5rem] sm:w-4/5 h-[2.8rem] w-2/3 mx-auto sm:mt-5 mt-6 ">
              <h2 className="text-[#2B193D] text-xl font-bold">
                Department-
              </h2>
              <div className="h-[2rem] w-full border-b-2">
                <input
                  type="text"
                  onChange={handleDepartmentChange}
                  value={department}
                  placeholder="CSE"
                  className="bg-white focus:outline-none text-[#B98389] text-[1.2rem] w-full"
                />
              </div>
            </div>
            

            {/*  Password */}
            <div className="sm:h-[3.5rem] sm:w-4/5 h-[2.8rem] w-2/3 mx-auto sm:mt-5 mt-6 ">
              <h2 className="text-[#2B193D] text-xl font-bold">
                Set Password-
              </h2>
              <div className="h-[2rem] w-full border-b-2">
                <input
                  type="password"
                  onChange={handlePasswordChange}
                  value={password}
                  className="bg-white focus:outline-none text-[#B98389] text-[1.2rem] w-full"
                />
              </div>
            </div>

            {/*  Confirm Password */}
            <div className="sm:h-[3.5rem] sm:w-4/5 h-[2.8rem] w-2/3 mx-auto sm:mt-5 mt-6 ">
              <h2 className="text-[#2B193D] text-xl font-bold">
                Confirm Password-
              </h2>
              <div className="h-[2rem] w-full border-b-2">
                <input
                  type="password"
                  onChange={handleConfirmPasswordChange}
                  value={confirmPassword}
                  className="bg-white focus:outline-none text-[#B98389] text-[1.2rem] w-full"
                />
              </div>
            </div>

            {/* Signup button */}
            <div className="sm:h-[4rem] sm:w-4/5 h-[3.5rem] w-full sm:mt-5 mt-6 flex items-center justify-center">
              <button
                onClick={handleSubmit}
                className="h-[3.5rem] w-[7.4rem] text-white bg-gradient-to-r from-[#78F6F7] via-[#576BD7] to-[#3E01BF] border-none rounded-full font-bold text-[1.2rem]"
              >
                Complete
              </button>
            </div>

            {showTerms && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className=" p-6 rounded-lg shadow-lg max-w-md w-full bg-gray-800">
                  <h3 className="text-xl font-semibold mb-4">
                    Terms and Conditions
                  </h3>
                  <p className="mb-4">
                    By signing up, you agree to our{" "}
                    <div
                    >
                      Terms and Conditions
                    </div>
                    .
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
      </div>
    </main>
  );
};

export default SignupPage;
