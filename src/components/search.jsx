import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

function Search({ placeholder, value, onChange }) {
  return (
    <div className="relative flex items-center mx-4 w-full bg-peach-50 rounded">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-500 w-full focus:outline-emerald-500"
      />
      <button className="absolute border-gray-300 shadow-lg rounded-lg my-2 p-2 right-0.5 cursor-pointer">
        <FiSearch className="text-slate-400 w-5 h-5 min-w-[20px]" />
      </button>
    </div>
  );
}

export default Search;
