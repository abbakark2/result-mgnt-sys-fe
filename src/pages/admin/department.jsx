import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { facultyActions } from "../../store/faculty-slice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "react-toastify";
import FacultyModal from "../../components/modal/faculty-modal";
import { FiTrash } from "react-icons/fi";

function Department() {
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
      const res = await axiosClient.get("/admin/faculties");
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

  return (
    <div className="p-4">
      <Link
        to="/admin/faculty/add"
        className="bg-indigo-500 float-right text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors inline-block"
      >
        Add Faculty ➕
      </Link>
      <h1 className="text-xl font-semibold mb-3">Faculties</h1>

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
        <ul className="space-y-2">
          {faculties.map((faculty) => (
            <li
              key={faculty.id}
              className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  {faculty.name}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {faculty.abbreviation}
                </span>
              </div>
              <div className="flex gap-2">
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
              </div>
            </li>
          ))}
        </ul>
      )}

      <FacultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSubmit={handleSubmit}
        initialData={selectedFaculty}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default Department;
