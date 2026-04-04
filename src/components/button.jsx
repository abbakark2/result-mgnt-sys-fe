import React from "react";

function Button({ children, onClick, ...attributes }) {
  return (
    <button
      {...attributes}
      onClick={onClick}
      className={`cursor-pointer px-4 py-2 rounded-lg transition-colors inline-block border text-sm ${attributes.className || "bg-gray-100 hover:bg-gray-200"}`}
    >
      {children}
    </button>
  );
}

export default Button;
