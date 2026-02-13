import React from "react";
import { FiHome } from "react-icons/fi";

function Breadcrumb({ currentPage }) {
  return (
    <h1 className="flex items-center gap-1">
      <FiHome />
      Dashboard / <span className="font-bold"> {currentPage}</span>
    </h1>
  );
}

export default Breadcrumb;
