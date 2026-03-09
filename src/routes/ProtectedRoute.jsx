// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN"); // Check ACCESS_TOKEN from localStorage

  if (!ACCESS_TOKEN) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
