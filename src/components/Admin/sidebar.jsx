import React, { useState } from "react";
import Avatar from "../../assets/images/avatar.png";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiLayers,
  FiUpload,
  FiSettings,
  FiChevronDown,
  FiBriefcase,
} from "react-icons/fi";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const userData = useSelector((state) => state.user.userData);
  const [academicStructureOpen, setAcademicStructureOpen] = useState(false);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
     ${
       isActive ? "bg-white/20 backdrop-blur-md shadow-lg" : "hover:bg-white/10"
     }`;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-xl border border-peach-200/40"
      >
        <span className="text-peach-800 font-bold">☰</span>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          h-screen w-75 overflow-y-auto
          bg-linear-to-b from-orange-300 via-rose-200 to-red-400 shadow-2xl backdrop-blur-xl
          border-r border-orange-700/40
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="flex gap-4 px-6 py-8 border-b border-peach-700/40">
          <div className="bg-peach-500/30 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border border-peach-300/40 shadow-inner">
            <span className="text-white font-black text-xl">U</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              USRPS
            </h1>
            <p className="text-xs text-peach-200/80 uppercase tracking-widest">
              Academic Portal
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="mx-4 my-6 p-4 rounded-2xl bg-white/5 border border-peach-700/30 flex items-center gap-3 shadow-2xl">
          <img
            src={Avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full border-2 border-peach-400/50 shadow-md"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">
              {userData?.name || "Admin User"}
            </p>
            <p className="text-[10px] text-peach-200 font-medium">
              SYSTEM ADMINISTRATOR
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          <NavLink to="/admin/dashboard" className={navItemClass}>
            <FiHome className="text-lg" />
            <span className="font-medium">Dashboard</span>
          </NavLink>

          {/* Academic Structure Accordion */}
          <div>
            <button
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-300 
                ${
                  academicStructureOpen
                    ? "bg-peach-700/60 text-white"
                    : "text-peach-200 hover:bg-peach-500/20"
                }`}
              onClick={() => setAcademicStructureOpen(!academicStructureOpen)}
            >
              <div className="flex items-center gap-3 font-medium">
                <FiBriefcase className="text-lg" />
                Academic Structure
              </div>
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  academicStructureOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Accordion Content */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                academicStructureOpen
                  ? "max-h-50 opacity-100 mt-2"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-6 border-l-2 border-peach-600/40 ml-6">
                <NavLink to="/admin/faculty" className={navItemClass}>
                  <FiLayers />
                  <span className="text-sm">Faculties</span>
                </NavLink>

                <NavLink to="/admin/department" className={navItemClass}>
                  <FiUsers />
                  <span className="text-sm">Departments</span>
                </NavLink>

                <NavLink to="/admin/students" className={navItemClass}>
                  <FiUsers className="text-lg" />
                  <span className="font-medium">Students</span>
                </NavLink>

                <NavLink to="/admin/courses" className={navItemClass}>
                  <FiBook className="text-lg" />
                  <span className="font-medium">Courses</span>
                </NavLink>
              </div>
            </div>
          </div>

          <NavLink to="/admin/uploads" className={navItemClass}>
            <FiUpload className="text-lg" />
            <span className="font-medium">Excel Uploads</span>
          </NavLink>

          <div className="pt-4 mt-4 border-t border-peach-700/40">
            <NavLink to="/admin/settings" className={navItemClass}>
              <FiSettings className="text-lg" />
              <span className="font-medium">Settings</span>
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
