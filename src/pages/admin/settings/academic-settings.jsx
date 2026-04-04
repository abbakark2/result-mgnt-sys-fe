import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetAcademicSessionQuery,
  useToggleAcademicSessionStatusMutation,
} from "../../../features/settings/settingsApi";
import ToggleButton from "../../../components/ToggleButton";

/**
 * AcademicSettings Component
 * Manages academic session status (only one session can be active at a time)
 */
function AcademicSettings() {
  const {
    data: sessions = [],
    isLoading,
    error,
  } = useGetAcademicSessionQuery();
  const [toggleStatus] = useToggleAcademicSessionStatusMutation();
  const [togglingId, setTogglingId] = useState(null);

  const handleToggleSession = async (sessionId, isCurrentlyActive) => {
    setTogglingId(sessionId);
    try {
      await toggleStatus(sessionId).unwrap();
      const actionText = isCurrentlyActive ? "deactivated" : "activated";
      toast.success(`Academic session ${actionText} successfully`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update session status");
    } finally {
      setTogglingId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600 font-medium">
            Loading academic sessions...
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-red-800 font-medium">
            Failed to load academic sessions
          </p>
          <p className="text-red-600 text-sm mt-1">
            {error?.data?.message || "Please try again later"}
          </p>
        </div>
      );
    }

    if (sessions.length === 0) {
      return (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-6 text-center">
          <p className="text-blue-800 font-medium">
            No academic sessions available
          </p>
          <p className="text-blue-600 text-sm mt-1">
            Contact administrator to create an academic session
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Session
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-24">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sessions.map((session) => {
              const isTogglingThisSession = togglingId === session.id;
              return (
                <tr
                  key={session.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        {session.name}
                      </span>
                      {session.is_active && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ToggleButton
                      isActive={session.is_active}
                      onToggle={() =>
                        handleToggleSession(session.id, session.is_active)
                      }
                      isLoading={isTogglingThisSession}
                      activeLabel="Active"
                      inactiveLabel="Inactive"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      disabled={isTogglingThisSession}
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Academic Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage academic sessions. Only one session can be active at a time.
        </p>
      </div>

      {/* Academic Sessions Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Academic Sessions
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Toggle to set the current academic session for the institution
          </p>
        </div>
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
}

export default AcademicSettings;
