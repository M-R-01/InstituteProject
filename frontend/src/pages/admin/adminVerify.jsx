// pages/VerifyPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import axios from "axios";

const AdminVerifyPage = () => {
  const {token} = useParams();
  const navigate = useNavigate();

  useEffect(() => {

    if (!token) return;

    axios
      .post(`https://instituteproject-1.onrender.com/admin-verify/${token}`)
      .then((res) => {
        const jwt = res.data.adminToken;
        const decodedToken = JSON.parse(atob(jwt.split(".")[1]));
        localStorage.setItem("adminEmail", decodedToken.Admin_Email);
        localStorage.setItem("adminToken", jwt);
        navigate("/admin/home");
      })
      .catch((err) => {
        console.error(err);
        navigate("/admin");
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-2xl">Verifying...</p>
    </div>
  );
};

export default AdminVerifyPage;
