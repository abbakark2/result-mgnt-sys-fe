import React from "react";
import { Link } from "react-router";

export const NavItem = ({ children, url }) => {
  return (
    <li className="cursor-pointer hover:text-teal-600 hover:border-b">
      <Link to={url} className="block">
        {children}
      </Link>
    </li>
  );
};
