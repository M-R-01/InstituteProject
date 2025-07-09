import React from "react";
import { Navigate } from "react-router-dom";

const isValidJWT = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    console.log(payload);
    return payload.exp && payload.exp > currentTime; // check token expiration
  } catch (err) {
    return false;
  }
};

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!isValidJWT(token)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
