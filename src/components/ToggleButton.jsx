import React from "react";

/**
 * ToggleButton component - Professional on/off toggle switch
 * @param {boolean} isActive - Current state of the toggle
 * @param {function} onToggle - Callback function when toggled
 * @param {boolean} isLoading - Show loading state
 * @param {string} activeLabel - Label for active state (default: "On")
 * @param {string} inactiveLabel - Label for inactive state (default: "Off")
 */
function ToggleButton({
  isActive,
  onToggle,
  isLoading = false,
  activeLabel = "On",
  inactiveLabel = "Off",
}) {
  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      className={`relative inline-flex items-center h-8 w-16 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${
          isActive
            ? "bg-green-500 focus:ring-green-400"
            : "bg-red-500 focus:ring-red-400"
        }
        ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"}
      `}
      title={isActive ? "Click to deactivate" : "Click to activate"}
    >
      {/* Animated toggle circle */}
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300
          ${isActive ? "translate-x-9" : "translate-x-1"}
        `}
      />

      {/* Status labels */}
      <span className="absolute inset-0 flex items-center justify-between px-2 text-xs font-semibold">
        <span
          className={`transition-opacity duration-300 ${
            !isActive ? "text-white opacity-100" : "opacity-0"
          }`}
        >
          {inactiveLabel}
        </span>
        <span
          className={`transition-opacity duration-300 ${
            isActive ? "text-white opacity-100" : "opacity-0"
          }`}
        >
          {activeLabel}
        </span>
      </span>

      {/* Loading spinner */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-4 w-4 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
    </button>
  );
}

export default ToggleButton;
