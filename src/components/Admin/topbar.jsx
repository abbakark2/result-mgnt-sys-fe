import React from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { useNavigate } from "react-router";

export default function TopBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(authActions.logout());
    navigate("/", { replace: true });
  };

  return (
    <div className="ml-75 flex justify-between p-4 pr-8 border-b bg-white">
      <h1 className="flex text-lg font-semibold text-center text-indigo-500">
        University Student Undergraduate Result Management System
      </h1>
      <button
        onClick={logout}
        className="text-red-500 bg-gray-200 px-4 py-2 rounded-lg cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
