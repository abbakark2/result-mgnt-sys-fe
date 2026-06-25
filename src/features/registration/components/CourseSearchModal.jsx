// src/features/registration/components/CourseSearchModal.jsx

import { useState, useMemo } from "react";

export default function CourseSearchModal({
  availableCourses,
  selectedIds,
  onAdd,
  onClose,
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return availableCourses.filter(
      (c) =>
        !selectedIds.includes(c.id) &&
        (c.course_code.toLowerCase().includes(q) ||
          c.course_title.toLowerCase().includes(q)),
    );
  }, [query, availableCourses, selectedIds]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-semibold text-gray-800">Add a Course</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            autoFocus
            type="text"
            placeholder="Search by code or title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm 
                                   focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Results */}
        <div className="px-4 pb-4 max-h-72 overflow-y-auto space-y-2">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              No courses found.
            </p>
          )}
          {filtered.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                onAdd(course);
                onClose();
              }}
              className="w-full text-left flex justify-between items-center 
                                       border rounded-lg px-3 py-2 hover:bg-blue-50 
                                       hover:border-blue-300 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {course.course_code}
                </p>
                <p className="text-xs text-gray-500">{course.course_title}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                {course.unit} units
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
