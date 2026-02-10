import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router";

function TopNav() {
  return (
    <nav className="flex justify-around bg-gray-200 max-h-14 items-center">
      <div>
        <Link to={"/"}>
          <img src={logo} alt="fes logo" className="max-h-12 py-2" />
        </Link>
      </div>
      <div>Undergraduate Result Management System</div>
      <div>
        <Link to={"/login"}>Login</Link>
      </div>
    </nav>
  );
}

export default TopNav;
