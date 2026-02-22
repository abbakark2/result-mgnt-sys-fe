import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { courseActions } from "../../store/course-slice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { FiTrash } from "react-icons/fi";
import Breadcrumb from "../../components/breadcrumb";
import Search from "../../components/search";
import Col2 from "../../components/col2";
import CourseModal from "../../components/modal/course-modal";
import { fetchCourses } from "../../store/course-slice";

function Courses() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.course.courses);
  const iscourseLoading = useSelector((state) => state.course.iscourseLoading);

  // Modal & Submission State
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await axiosClient.put(
        `/admin/course/${selectedCourse.id}`,
        formData,
      );

      const successMsg = res.data.message || "Course updated successfully";
      toast.success(`${res.status} | ${successMsg}`);

      setIsModalOpen(false);
      fetchCourses(); // Refresh the list
    } catch (error) {
      const statusCode = error.response
        ? error.response.status
        : "Network Error";
      const errorMessage =
        error.response?.data?.message || "An error occurred during update";
      toast.error(
        <div>
          <strong>{statusCode}</strong>: {errorMessage}
        </div>,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course) => {
    setSelectedcourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Course?")) {
      try {
        await axiosClient.delete(`/admin/Course/${id}`);
        toast.success("Course deleted successfully");
        fetchCourses(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete Course");
      }
    }
  };

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
      total: courses.filter((course) => course.status === "Active").length,
      class: "bg-green-100",
    },
    {
      id: 3,
      label: "Inactive Courses",
      total: courses.filter((course) => course.status === "Inactive").length,
      class: "bg-red-100",
    },
    {
      id: 4,
      label: "Departments",
      total: new Set(courses.map((course) => course.department_id)).size,
      class: "bg-yellow-100",
    },
  ];

  return (
    <div className="p-4 overflow-hidden">
      <h1 className="text-2xl font-bold mb-3">Courses</h1>
      <div className="flex justify-between items-center">
        {/* Breadcrumb row */}
        <div className="">
          <Breadcrumb currentPage="Courses" />
        </div>
        {/* Import and add Course row */}
        <div className="flex gap-2 ">
          <button className="bg-peach-50 px-4 py-2 rounded-lg hover:bg-peach-100 transition-colors inline-block border text-sm cursor-pointer">
            Import
          </button>
          <button
            onClick={() => setCourseModalOpen(true)}
            className="px-5 py-2 rounded-lg bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Add Course ➕
          </button>
        </div>
      </div>

      {/* MAIN CONTENTS */}
      <div className="mt-4 p-4 bg-white rounded-2xl">
        {/* Search Row */}
        <div className="flex justify-between">
          <Search placeholder="Search Courses" />
          <div className="flex gap-2 items-center">
            <select name="" id="" className="p-2 bg-peach-50">
              <option value="">All Courses</option>
            </select>
            <div className="flex items-center p-2 bg-peach-50">
              Sort by:
              <select name="" id="">
                <option value="">Newest</option>
              </select>
            </div>
          </div>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-4 my-4 gap-4">
          {statsData.map((data) => (
            <Col2
              key={data.id}
              label={data.label}
              total={data.total}
              className={data.class || ""}
            />
          ))}
        </div>
        <div className="my-4">
          {iscourseLoading ? (
            <div className="flex items-center justify-center space-x-2 py-10">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              <span className="text-indigo-500 font-medium">
                Loading Courses...
              </span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-10 text-peach-400 text-lg">
              No Course found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="border-separate border-spacing-y-2 min-w-200 text-left text-slate-700">
                <thead>
                  <tr>
                    <th className="p-4">Course Name</th>
                    <th className="p-4">Code</th>
                    <th className="p-4">#Departments</th>
                    <th className="p-4">#Students</th>
                    <th className="p-4">#Courses</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((Course) => (
                    <tr
                      key={Course.id}
                      className="bg-peach-50 border border-stone-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      {/* Course name and abbreviation */}
                      <td className="p-4 font-medium text-slate-900">
                        {Course.name}
                      </td>
                      <td className="p-4 text-peach-400 uppercase tracking-wide">
                        {Course.abbreviation}
                      </td>
                      <td className="p-4 text-center">
                        {Course?.departments?.length || 0}
                      </td>
                      <td>65546</td>
                      <td>345</td>
                      <td>Active</td>
                      <td>2026-02-13</td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => handleEdit(Course)}
                          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white transition-colors shadow-sm"
                        >
                          Edit
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(Course.id)}
                          className="text-xs text-red-500 flex items-center gap-1 mt-1 transition-colors w-fit border hover:text-white hover:bg-red-500 border-red-500 hover:border-red-700 px-2 py-1 rounded cursor-pointer"
                        >
                          <FiTrash className="text-current" />
                          <span>Delete Course</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <CourseModal
            isOpen={courseModalOpen}
            onClose={() => setCourseModalOpen(false)}
            handleSubmit={handleSubmit}
            initialData={selectedCourse}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default Courses;
