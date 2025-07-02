import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PUBLIC_ROUTES = [
  "/", "/signup", "/forgotpassword", "/resetpassword", "/admin"
];

function SessionManager({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      location.pathname.startsWith(route)
    );

    if (!token && !isPublicRoute) {
      navigate("/");
      return;
    }

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = payload.exp * 1000;
        const timeLeft = expiryTime - Date.now();

        if (timeLeft <= 0) {
          localStorage.removeItem("token");
          alert("Session expired. Please login again.");
          navigate("/");
        } else {
          // Auto logout timer
          const timeout = setTimeout(() => {
            localStorage.removeItem("token");
            alert("Session expired. Please login again.");
            navigate("/");
          }, timeLeft);

          return () => clearTimeout(timeout); // cleanup on unmount
        }
      } catch (e) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [location, navigate]);

  return <>{children}</>;
}

export default SessionManager;
