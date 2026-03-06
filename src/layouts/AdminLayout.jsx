import React, { useEffect } from "react";
import Sidebar from "../components/Admin/sidebar";
import TopBar from "../components/Admin/topbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-stone-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 relative mt-4 md:mt-12 ml-0 md:ml-75 min-h-screen p-6 overflow-y-auto bg-gray-600 z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
