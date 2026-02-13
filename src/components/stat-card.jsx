import React from "react";
import { FiUsers } from "react-icons/fi";

function StatCard() {
  return (
    <div className="flex h-25 p-4 my-4 bg-white rounded-xl  shadow-lg">
      <div className="flex gap-4 ">
        <div className="flex gap-2">
          <div>
            <FiUsers className="p-2 text-center rounded-full h-10 w-10 bg-teal-800 text-white" />
          </div>
        </div>
        <div>
          <div>Total Students</div>
          <p className="p-1 pl-0 text-2xl">48</p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
