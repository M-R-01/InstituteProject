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
      .post(`https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/admin-verify/${token}`)
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
