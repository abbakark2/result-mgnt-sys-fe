import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectCurrentRole,
  selectIsInitialized,
  selectCurrentUser,
  initializeAuth,
} from "../store/auth-slice";
import { useEffect } from "react";

function ProtectedRoute({ allowedRoles }) {
  const isInitialized = useSelector(selectIsInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectCurrentRole);
  const location = useLocation();

  // Wait until auth initialization finishes
  if (!isInitialized) {
    console.log("Auth not initialized yet", isInitialized);
    return <div>from protected route loading... </div>; // or loading spinner
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // // Role check
  // if (allowedRoles && !allowedRoles.includes(role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <Outlet />;
}

export default ProtectedRoute;
