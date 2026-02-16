import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { facultyActions } from "../../store/faculty-slice";

const DepartmentModal = ({
  isOpen,
  onClose,
  handleSubmit,
  initialData,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    faculty_id: "",
    faculty: "",
  });

  const faculties = useSelector((state) => state.faculty.faculties);
  const dispatch = useDispatch();

  const fetchFaculties = async () => {
    const res = await axiosClient.get("/admin/faculties");
    if (res.data && res.data.Faculties) {
      dispatch(facultyActions.setFaculties(res.data.Faculties));
      toast.success("Faculties fetched successfully");
    } else {
      toast.error("Failed to fetch faculties");
    }
  };

  useEffect(() => {
    fetchFaculties();

    if (initialData) {
      setFormData({
        name: initialData.name || "",
        faculty_id: initialData.faculty_id || "",
        faculty: initialData.faculty.name || "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : null}
      />

      <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md z-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Edit Department
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Department Name
            </label>
            <input
              type="text"
              name="name"
              required
              disabled={isSubmitting}
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Faculty
            </label>
            <select
              name="faculty_id"
              id="faculty_id"
              value={formData.faculty_id || ""} // Use value prop instead of selected
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            >
              <option value="">Select Faculty</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-colors disabled:bg-indigo-300 flex items-center justify-center min-w-30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;
