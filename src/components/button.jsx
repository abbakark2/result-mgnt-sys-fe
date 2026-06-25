import React from "react";

// ─── Sub-component: Reusable Button ──────────────────────────────────────────
const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-lg px-5 py-2.5 text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white focus:ring-indigo-500",
    success:
      "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white focus:ring-emerald-500",
    danger:
      "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus:ring-red-500",
    ghost:
      "bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-400",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
