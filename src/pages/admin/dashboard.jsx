import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/stat-card";
import { FiUser } from "react-icons/fi";
import ActivityCard from "../../components/recent-activity";

function Dashboard() {
  return (
    <div>
      <section className="p-4 rounded-lg bg-indigo-500 text-white">
        <h1 className="text-2xl mb-2">Good Morning Abubakar</h1>
        <p className="text-sm mt-2">
          Here is an Overview of the Academic System
        </p>
      </section>

      <section className="mt-4 flex flex-col md:flex-row gap-4">
        <div className="w-full h-wrap grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard /> <StatCard /> <StatCard />
          <StatCard /> <StatCard /> <StatCard />
        </div>
        <div className="p-4 min-w-[350px] w-full md:w-1/3 flex flex-col gap-4">
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <h1>
              <b>Quick Insights</b>
            </h1>
            <p className="flex items-center">
              <span className="text-2xl">• </span>&nbsp; Active Session
            </p>

            <div className="flex justify-between items-center mb-4">
              <p className="text-2xl font-bold">2026/2027</p>
              <span className="px-4 py-2  rounded-lg text-white bg-teal-500">
                Active
              </span>
            </div>

            <p className="text-sm">Results Uploaded</p>
            <p>=======================</p>
            <p className="my-2 text-sm">Pending Approval</p>
            <p className="flex justify-between my-2 text-sm">
              🔴 Just Now{" "}
              <span className="mr-4 px-2 py-1 rounded-lg bg-indigo-100 flex items-center gap-1">
                <FiUser />
                24
              </span>
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-lg">
            <h1>Recent Activity </h1>
            <div className="max-h-[250px] overflow-auto">
              <ActivityCard />
              <ActivityCard />
              <ActivityCard />
              <ActivityCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
