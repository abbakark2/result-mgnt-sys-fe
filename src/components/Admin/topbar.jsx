import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/auth-slice";
import { useNavigate } from "react-router-dom"; // Ensure correct import
import { useLogoutMutation } from "../../features/auth/authApi";
import { toast } from "react-toastify";

export default function TopBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const Token = localStorage.getItem("ACCESS_TOKEN");

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint to delete tokens from database
      await logoutApi().unwrap();
    } catch (error) {
      // Log error but proceed with local logout for user experience
      console.error("Logout API error:", error);
      toast.warning("Session cleared locally (server sync failed)");
    } finally {
      // Clear local state regardless of API response
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("role");
      dispatch(logout());
      navigate("/", { replace: true });
    }
  };

  return (
    <header
      /* FIX: Instead of w-full + margin, use left property to prevent overflow.
         Mobile: left-0 | Desktop: left-72 (adjust to match your sidebar width)
      */
      className="fixed top-0 right-0 left-0 md:left-71 z-40 
                 flex items-center justify-between 
                 p-4 px-6 md:px-8
                 bg-gray-900/80 backdrop-blur-md 
                 border-b border-white/10 shadow-lg 
                 transition-all duration-300"
    >
      {/* Title - Hidden on very small screens or truncated to save space */}
      <h1 className=" pl-11 text-sm md:text-lg font-bold tracking-tight text-white truncate mr-4">
        <span className="hidden sm:inline">University Student </span>
        Undergraduate Results
      </h1>

      {/* Logout Button - Enhanced Styles */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="relative group flex items-center justify-center 
                   px-5 py-2 text-sm font-medium bg-gray-400
                   text-red-600 rounded-full overflow-hidden
                   shadow-[0_0_15px_rgba(220,38,38,0.3)]
                   hover:bg-gray-800  hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]
                   active:scale-95 transition-all duration-200 cursor-pointer
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10">
          {isLoggingOut ? "Logging out..." : "Logout"}
        </span>
        {/* Subtle hover shine effect */}
        <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    </header>
  );
}
