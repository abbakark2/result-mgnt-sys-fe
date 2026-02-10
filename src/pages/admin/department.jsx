import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { departmentActions } from "../../store/department-slice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "react-toastify";
import DepartmentModal from "../../components/modal/department-modal";
import { FiTrash } from "react-icons/fi";

function Department() {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.department.departments);
  const isLoading = useSelector((state) => state.department.isLoading);

  // Modal & Submission State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      dispatch(departmentActions.setIsLoading(true));
      const res = await axiosClient.get("/admin/dept");
      dispatch(departmentActions.setDepartments(res.data.Departments));
    } catch (error) {
      const statusCode = error.response ? error.response.status : "Error";
      const errorMessage =
        error.response?.data?.message || "Failed to fetch departments";
      toast.error(
        <div>
          <strong>{statusCode}</strong>: {errorMessage}
        </div>,
      );
    } finally {
      dispatch(departmentActions.setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (selectedDepartment) {
        res = await axiosClient.put(
          `/admin/dept/${selectedDepartment.id}`,
          formData,
        );
      } else {
        res = await axiosClient.post("/admin/dept", formData);
      }

      const successMsg = res.data.message || "Operation successful";
      toast.success(`${res.status} | ${successMsg}`);

      setIsModalOpen(false);
      fetchDepartments();
    } catch (error) {
      const statusCode = error.response
        ? error.response.status
        : "Network Error";
      const errorMessage =
        error.response?.data?.message || "An error occurred during operation";
      toast.error(
        <div>
          <strong>{statusCode}</strong>: {errorMessage}
        </div>,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axiosClient.delete(`/admin/dept/${id}`);
        toast.success("Department deleted successfully");
        fetchDepartments();
      } catch (error) {
        toast.error("Failed to delete department");
      }
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => {
          setSelectedDepartment(null);
          setIsModalOpen(true);
        }}
        className="bg-indigo-500 float-right text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors inline-block"
      >
        Add Department ➕
      </button>
      <br />
      <h1 className="text-xl font-semibold mb-3">Departments</h1>

      {isLoading ? (
        <div className="flex items-center justify-center space-x-2 py-10">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <span className="text-indigo-500 font-medium">
            Loading departments...
          </span>
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">
          No departments found
        </div>
      ) : (
        <ul className="space-y-2">
          {departments.map((department) => (
            <li
              key={department.id}
              className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  {department.name}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Faculty ID: {department.faculty_id}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(department)}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white transition-colors shadow-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(department.id)}
                  className="text-xs text-red-500 flex items-center gap-1 mt-1 transition-colors w-fit border hover:text-white hover:bg-red-500 border-red-500 hover:border-red-700 px-2 py-1 rounded cursor-pointer"
                >
                  <FiTrash className="text-current" />
                  <span>Delete Department</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSubmit={handleSubmit}
        initialData={selectedDepartment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default Department;
