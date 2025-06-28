import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem("user_id"); // or use context/state

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
