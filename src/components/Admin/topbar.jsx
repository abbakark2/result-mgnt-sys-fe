import React from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { useNavigate } from "react-router-dom"; // Ensure correct import

export default function TopBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(authActions.logout());
    navigate("/", { replace: true });
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
      <h1 className="text-sm md:text-lg font-bold tracking-tight text-white truncate mr-4">
        <span className="hidden sm:inline">University Student </span>
        Undergraduate Results
      </h1>

      {/* Logout Button - Enhanced Styles */}
      <button
        onClick={logout}
        className="relative group flex items-center justify-center 
                   px-5 py-2 text-sm font-medium text-white
                   bg-red-600 rounded-full overflow-hidden
                   shadow-[0_0_15px_rgba(220,38,38,0.3)]
                   hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]
                   active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <span className="relative z-10">Logout</span>
        {/* Subtle hover shine effect */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    </header>
  );
}
