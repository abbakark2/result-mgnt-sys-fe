import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { facultyActions } from "../../store/faculty-slice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "react-toastify";
import FacultyModal from "../../components/modal/faculty-modal";
import { FiTrash } from "react-icons/fi";
import Breadcrumb from "../../components/breadcrumb";
import Search from "../../components/search";
import Col2 from "../../components/col2";

function Faculty() {
  const dispatch = useDispatch();
  const faculties = useSelector((state) => state.faculty.faculties);
  const isLoading = useSelector((state) => state.faculty.isLoading);

  // Modal & Submission State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFaculties = async () => {
    try {
      dispatch(facultyActions.setIsLoading(true));
      const res = await axiosClient.get("/admin/faculties/data");
      dispatch(facultyActions.setFaculties(res.data.Faculties));
    } catch (error) {
      const statusCode = error.response ? error.response.status : "Error";
      const errorMessage =
        error.response?.data?.message || "Failed to fetch faculties";
      toast.error(
        <div>
          <strong>{statusCode}</strong>: {errorMessage}
        </div>,
      );
    } finally {
      dispatch(facultyActions.setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await axiosClient.put(
        `/admin/faculty/${selectedFaculty.id}`,
        formData,
      );

      const successMsg = res.data.message || "Faculty updated successfully";
      toast.success(`${res.status} | ${successMsg}`);

      setIsModalOpen(false);
      fetchFaculties(); // Refresh the list
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

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      try {
        await axiosClient.delete(`/admin/faculty/${id}`);
        toast.success("Faculty deleted successfully");
        fetchFaculties(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete faculty");
      }
    }
  };

  const statsData = [
    {
      id: 1,
      total: faculties.length,
      label: "Faculties",
      class: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
    },
    {
      id: 2,
      total: 26,
      label: "Departments",
      class: "bg-gradient-to-r from-green-500 to-teal-500 text-white",
    },
    {
      id: 3,
      total: "4,832",
      label: "Students",
      class: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    },
    {
      id: 4,
      total: 314,
      label: "Total Courses",
      class: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
    },
  ];

  return (
    <div className="p-4 overflow-hidden">
      <h1 className="text-2xl font-bold mb-3">Faculties</h1>
      <div className="flex justify-between items-center">
        {/* Breadcrumb row */}
        <div className="">
          <Breadcrumb currentPage="Faculties" />
        </div>
        {/* Import and add faculty row */}
        <div className="flex gap-2 ">
          <button className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block border text-sm cursor-pointer">
            Import
          </button>
          <Link
            to="/admin/faculty/add"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors inline-block"
          >
            Add Faculty ➕
          </Link>
        </div>
      </div>

      {/* MAIN CONTENTS */}
      <div className="mt-4 p-4 bg-white rounded-2xl">
        {/* Search Row */}
        <div className="flex justify-between">
          <Search placeholder="Search faculties" />
          <div className="flex gap-2 items-center">
            <select name="" id="" className="p-2 bg-gray-100">
              <option value="">All Faculties</option>
            </select>
            <div className="flex items-center p-2 bg-gray-100">
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
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2 py-10">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              <span className="text-indigo-500 font-medium">
                Loading faculties...
              </span>
            </div>
          ) : faculties.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-lg">
              No faculties found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="border-separate border-spacing-y-2 min-w-200 text-left text-gray-600">
                <thead>
                  <tr>
                    <th className="p-4">Faculty Name</th>
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
                  {faculties.map((faculty) => (
                    <tr
                      key={faculty.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      {/* Faculty name and abbreviation */}
                      <td className="p-4 font-medium text-gray-800">
                        {faculty.name}
                      </td>
                      <td className="p-4 text-gray-500 uppercase tracking-wide">
                        {faculty.abbreviation}
                      </td>
                      <td className="p-4 text-center">
                        {faculty?.departments?.length || 0}
                      </td>
                      <td>65546</td>
                      <td>345</td>
                      <td>Active</td>
                      <td>2026-02-13</td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => handleEdit(faculty)}
                          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white transition-colors shadow-sm"
                        >
                          Edit
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(faculty.id)}
                          className="text-xs text-red-500 flex items-center gap-1 mt-1 transition-colors w-fit border hover:text-white hover:bg-red-500 border-red-500 hover:border-red-700 px-2 py-1 rounded cursor-pointer"
                        >
                          <FiTrash className="text-current" />
                          <span>Delete Faculty</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <FacultyModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            handleSubmit={handleSubmit}
            initialData={selectedFaculty}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default Faculty;
