import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiTrash } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import Breadcrumb from "../../components/breadcrumb";
import Search from "../../components/search";
import Col2 from "../../components/col2";
import CourseModal from "../../components/modal/course-modal";
import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
} from "../../services/api";

function Courses() {
  const { data: courses = [], isLoading: isCourseLoading } =
    useGetCoursesQuery();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAdd = () => {
    setSelectedCourse(null); // null = add mode
    setCourseModalOpen(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course); // populated = edit mode
    setCourseModalOpen(true);
  };

  const handleModalClose = () => {
    setCourseModalOpen(false);
    // Slight delay so modal exit animation doesn't flash stale data
    setTimeout(() => setSelectedCourse(null), 200);
  };

  // Called by CourseModal after a successful add or update
  const handleMutationSuccess = () => {
    handleModalClose();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setDeletingId(id);
    try {
      await deleteCourse(id).unwrap();
      toast.success("Course deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────

  const statsData = [
    {
      id: 1,
      label: "Total Courses",
      total: courses.length,
      class: "bg-peach-100",
    },
    {
      id: 2,
      label: "Active Courses",
      total: courses.filter((c) => c.status === "Active").length,
      class: "bg-green-100",
    },
    {
      id: 3,
      label: "Inactive Courses",
      total: courses.filter((c) => c.status === "Inactive").length,
      class: "bg-red-100",
    },
    {
      id: 4,
      label: "Departments",
      total: new Set(courses.map((c) => c.department_id)).size,
      class: "bg-yellow-100",
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 overflow-hidden">
      <h1 className="text-2xl text-white font-bold mb-3">Courses</h1>

      <div className="flex justify-between items-center text-white">
        <Breadcrumb currentPage="Courses" />
        <div className="flex gap-2">
          <button className="bg-peach-50 px-4 py-2 rounded-lg hover:bg-peach-100 transition-colors inline-block border text-sm cursor-pointer">
            Import
          </button>
          <button
            onClick={handleAdd}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Add Course ➕
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="mt-4 p-4 bg-white rounded-2xl">
        {/* Search + filter row */}
        <div className="flex justify-between">
          <Search placeholder="Search Courses" />
          <div className="flex gap-2 items-center">
            <select className="p-2 bg-peach-50 rounded">
              <option value="">All Courses</option>
            </select>
            <div className="flex items-center gap-1 p-2 bg-peach-50 rounded">
              Sort by:
              <select>
                <option value="">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 my-4 gap-4">
          {statsData.map((data) => (
            <Col2
              key={data.id}
              label={data.label}
              total={data.total}
              className={data.class}
            />
          ))}
        </div>

        {/* Table */}
        <div className="my-4">
          {isCourseLoading ? (
            <div className="flex items-center justify-center space-x-2 py-10">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-indigo-500 font-medium">
                Loading Courses…
              </span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-lg">
              No courses found. Click <strong>Add Course</strong> to get
              started.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="border-separate border-spacing-y-2 min-w-full text-left text-slate-700">
                <thead>
                  <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Course Title</th>
                    <th className="px-4 py-2 text-center">Units</th>
                    <th className="px-4 py-2">Semester</th>
                    <th className="px-4 py-2">Level</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr
                      key={course.id}
                      className="bg-peach-50 hover:shadow-sm transition-shadow rounded-lg"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900 rounded-l-lg">
                        {course.course_code}
                      </td>
                      <td className="px-4 py-3 text-peach-400 uppercase tracking-wide text-xs">
                        {course.course_title}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {course.unit ?? "—"}
                      </td>
                      <td className="px-4 py-3">{course.semester ?? "—"}</td>
                      <td className="px-4 py-3">{course.level}L</td>
                      <td className="px-4 py-3">
                        {course.department?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 rounded-r-lg">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => handleEdit(course)}
                            className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 rounded-lg text-white text-xs font-medium transition-colors shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            disabled={deletingId === course.id}
                            className="flex items-center gap-1 px-2 py-1.5 text-xs text-red-500 border border-red-300
                                       hover:text-white hover:bg-red-500 hover:border-red-500 rounded
                                       transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {deletingId === course.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <FiTrash className="w-3 h-3" />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal — rendered outside the table so z-index is clean */}
      <CourseModal
        isOpen={courseModalOpen}
        onClose={handleModalClose}
        handleSubmit={handleMutationSuccess}
        initialData={selectedCourse}
      />
    </div>
  );
}

export default Courses;
