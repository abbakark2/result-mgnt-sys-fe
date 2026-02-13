import React from "react";

function Col2({ total, label, className = "", ...rest }) {
  return (
    <div
      className={`flex items-center gap-2 border p-4 rounded-lg ${className} shadow-gray-400 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300`}
      {...rest}
    >
      <div>{total}</div>
      <div>{label}</div>
    </div>
  );
}

export default Col2;
