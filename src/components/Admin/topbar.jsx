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
    <div className="flex justify-end p-4 pr-8 border-b bg-white">
      <button
        onClick={logout}
        className="text-red-500 bg-gray-200 px-4 py-2 rounded-lg cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
