import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { departmentActions } from "../../store/department-slice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "react-toastify";
import DepartmentModal from "../../components/modal/department-modal";
import { FiTrash } from "react-icons/fi";
import Breadcrumb from "../../components/breadcrumb";
import Search from "../../components/search";
import Col2 from "../../components/col2";
import { fetchDepartments } from "../../store/department-slice";
import { FiPenTool } from "react-icons/fi";

function Department() {
  const dispatch = useDispatch();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { departments, isLoading } = useSelector((state) => state.department);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
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
      dispatch(fetchDepartments(true)); // Force refetch after add/edit
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
        dispatch(fetchDepartments(true));
        setSelectedDepartment(null);
      } catch (error) {
        toast.error("Failed to delete department");
      }
    }
  };

  const statsData = [
    {
      id: 1,
      total: departments.length || 0,
      label: "Departments",
      class: "bg-linear-to-r from-gray-500 to-gray-200 text-white",
    },
    {
      id: 2,
      total: 10, // Dummy data
      label: "Faculties",
      class: "bg-linear-to-r from-gray-500 to-gray-200 text-white",
    },
    {
      id: 3,
      total: "1,200", // Dummy data
      label: "Students",
      class: "bg-linear-to-r from-gray-500 to-gray-200 text-white",
    },
    {
      id: 4,
      total: 150, // Dummy data
      label: "Courses",
      class: "bg-linear-to-r from-gray-500 to-gray-200 text-white",
    },
  ];

  return (
    <div className="p-4 overflow-hidden">
      <h1 className="text-2xl text-white font-bold mb-3">Departments</h1>
      <div className="flex justify-between items-center">
        {/* Breadcrumb row */}
        <div className="text-white">
          <Breadcrumb currentPage="Departments" />
        </div>
        {/* Import and add department row */}
        <div className="flex gap-2 ">
          <button className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block border text-sm cursor-pointer">
            Import
          </button>
          <button
            onClick={() => {
              setSelectedDepartment(null);
              setIsModalOpen(true);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-block shadow-2xl shadow-white border border-white"
          >
            Add Department ➕
          </button>
        </div>
      </div>

      {/* MAIN CONTENTS */}
      <div className="mt-4 p-4 bg-white rounded-2xl">
        {/* Search Row */}
        <div className="flex justify-between">
          <Search placeholder="Search departments" />
          <div className="flex gap-2 items-center">
            <select name="" id="" className="p-2 bg-gray-100">
              <option value="">All Departments</option>
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
              <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              <span className="text-gray-500 font-medium">
                Loading departments...
              </span>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-lg">
              No departments found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-gray-100">
              <table className="border-separate border-spacing-y-2 min-w-200 text-left text-gray-600">
                <thead>
                  <tr>
                    <th className="p-4">Department Name</th>
                    <th className="p-4">Faculty</th>
                    <th className="p-4">#Students</th>
                    <th className="p-4">#Courses</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department, i) => (
                    <tr
                      key={department.id}
                      className={`${i % 2 == 0 ? "border-b-2" : "bg-gray-50"} border border-gray-200 rounded-lg hover:shadow-sm transition-shadow`}
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {department.name || "N/A"}
                      </td>
                      <td className="p-4 text-gray-500 uppercase tracking-wide">
                        {department.faculty?.name || "N/A"}
                      </td>
                      <td className="p-4 text-center">
                        {department.students || 0}
                      </td>
                      <td className="p-4 text-center">
                        {department.courses || 0}
                      </td>
                      <td className="p-4">Active</td>
                      <td className="p-4">2026-02-13</td>
                      <td className="flex items-center mt-3 gap-2">
                        <button
                          onClick={() => handleEdit(department)}
                          className="flex items-center gap-2 px-4 py-2 bg-neutral-600 cursor-pointer hover:border hover:border-stone-800 hover:bg-white hover:text-stone-800 rounded-lg text-white transition-colors shadow-sm"
                        >
                          <FiPenTool className="rotate-270" />
                        </button>
                        <button
                          onClick={() => handleDelete(department.id)}
                          className="flex items-center py-2 gap-1 text-red-500 border border-red-500 px-4 hover:bg-red-500 hover:text-white rounded cursor-pointer"
                        >
                          <FiTrash className="text-red bg-red" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <DepartmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            handleSubmit={handleSubmit}
            initialData={selectedDepartment}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default Department;
