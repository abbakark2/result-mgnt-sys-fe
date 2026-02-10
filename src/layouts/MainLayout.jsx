import React from "react";
import TopNave from "../components/top-nav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainLayout({ children }) {
  return (
    <div>
      <header>
        <TopNave />
        <ToastContainer position="top-right" autoClose={3000} />
      </header>
      <main>{children}</main>
    </div>
  );
}

export default MainLayout;
