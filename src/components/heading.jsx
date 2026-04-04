import React from "react";

function Heading({ children }) {
  return (
    <div>
      <h1 className="text-white font-bold text-xl">{children}</h1>
    </div>
  );
}

export default Heading;
