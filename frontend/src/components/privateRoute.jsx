import React from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
