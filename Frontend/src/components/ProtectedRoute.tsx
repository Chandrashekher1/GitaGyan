import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      // Store the current location to redirect back after login
      localStorage.setItem("redirectPath", location.pathname);
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  if (!isLoggedIn) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};
