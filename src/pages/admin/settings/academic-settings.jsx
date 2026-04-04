import React, { useEffect } from "react";
import { useGetAcademicSessionQuery } from "../../../features/settings/settingsApi";

function AcademicSettings() {
  const { data: sessions = [], isLoading } = useGetAcademicSessionQuery();
  return (
    <div className="m-5 p-4 bg-gray-200 rounded-lg shadow-lg">
      <h1 className="font-bold text-2xl mb-4">Academic Settings</h1>

      <section>
        <h2 className="font-bold">Academic Year</h2>
        <p className="italic mb-2">
          Set the current academic year for the institution.
        </p>
        {/* Available Academic sessions */}
        <table width="100%" className="text-left">
          <thead>
            <tr>
              <th>SN</th>
              <th>Academic Session</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{isLoading && "loading..."}</td>
              <td>{!isLoading && "Fetched successfully"}</td>
            </tr>
            {/* {data.length > 0 ? (
              data.map((session, i) => {
                <tr key={session.id}>
                  <td>{i}</td>
                  <td>{session.name}</td>
                  <td>{session.is_active ? "Active" : "Inactive"}</td>
                </tr>;
              })
            ) : (
              <tr>
                <td></td>
                <td>No data found</td>
                <td></td>
              </tr>
            )} */}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AcademicSettings;
