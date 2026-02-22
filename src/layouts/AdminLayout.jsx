import React, { useEffect } from "react";
import Sidebar from "../components/Admin/sidebar";
import TopBar from "../components/Admin/topbar";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/user-slice";
import axiosClient from "../axios-client";
import { toast } from "react-toastify";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  const accessToken = useSelector((state) => state.auth.ACCESS_TOKEN);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(userActions.setIsLoading(true));
        const res = await axiosClient.get("/user");
        dispatch(userActions.setUserData(res.data));
      } catch {
        toast.error("Failed to fetch user data");
      } finally {
        dispatch(userActions.setIsLoading(false));
      }
    };

    if (accessToken) fetchUser();
  }, [accessToken, dispatch]);

  return (
    <div className="flex min-h-screen bg-stone-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 ml-0 md:ml-75 min-h-screen p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
