import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../axios-client";
import { X, Loader2, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchDepartments } from "../../store/department-slice";

const INITIAL_FORM = {
  course_code: "",
  course_title: "",
  unit: "",
  level: "",
  semester: "1st",
  department_id: "",
};

const CURRENT_YEAR = new Date().getFullYear();

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
      {message}
    </p>
  );
}

function FormField({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-lg outline-none transition-all duration-200
   placeholder:text-slate-400 text-slate-800
   focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
   ${hasError ? "border-rose-400 bg-rose-50/30" : "border-slate-200 hover:border-slate-300"}`;

const selectClass = (hasError) =>
  `${inputClass(hasError)} appearance-none cursor-pointer pr-9`;

function SelectWrapper({ children, isLoading }) {
  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </div>
    </div>
  );
}

function CourseModal({
  isOpen,
  onClose,
  initialData,
  isSubmitting,
  setIsSubmitting,
  fetchStudents,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const iscourseLoading = useSelector((state) => state.course.iscourseLoading);
  const departments = useSelector((state) => state.department.departments);
  const dispatch = useDispatch();

  const isEditMode = Boolean(initialData?.id);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDepartments());
      if (initialData?.id) {
        // Map API response data to form structure for edit mode
        const formData = {
          course_id: initialData.user?.course_id || "",
          department_id: initialData.user?.department_id || "",
        };
        setFormData(formData);
      } else {
        // Reset to initial form for add mode
        setFormData(INITIAL_FORM);
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, initialData]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handlecourseChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, course_id: value, department_id: "" }));
    if (touched.course_id) validateField("course_id", value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    // validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // For edit mode, send the complete form data
        await axiosClient.put(`/admin/students/${initialData.id}`, formData);
        toast.success("Student updated successfully");
      } else {
        // For add mode, send the form data
        await axiosClient.post("/admin/students", formData);
        toast.success("Student added successfully");
      }
      onClose();
      await fetchStudents();
    } catch (error) {
      const msg =
        error.response?.data?.message || "An error occurred while saving.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Panel */}
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl shadow-slate-900/20 flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {isEditMode ? "Edit Student Record" : "Register New Student"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditMode
                ? "Update the student's information below."
                : "Fill in the details to register a new student."}
            </p>
          </div>
          <button
            type="button"
            onClick={!isSubmitting ? onClose : undefined}
            disabled={isSubmitting}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150 disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Section: Course Info */}
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {/* Course code */}
              <FormField
                label="Course Code"
                required
                error={errors.course_code}
              >
                <input
                  type="text"
                  name="course_code"
                  value={formData.course_code || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. GST123"
                  className={inputClass(errors.course_code)}
                />
              </FormField>

              {/* Course Title */}
              <FormField
                label="Course Title"
                required
                error={errors.course_title}
              >
                <input
                  placeholder="Introduction to Computer"
                  type="text"
                  name="course_title"
                  value={formData.course_title || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(errors.course_title)}
                />
              </FormField>

              {/* Course Credit Unit */}
              <FormField
                label="course Credit Unit"
                required
                error={errors.unit}
              >
                <SelectWrapper>
                  <select
                    name="unit"
                    value={formData.unit || ""}
                    onChange={handleChange}
                    selected={formData.unit === "male"}
                    onBlur={handleBlur}
                    className={selectClass(errors.unit)}
                  >
                    <option value="" disabled>
                      Select unit
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </FormField>

              {/* Course Level */}
              <FormField
                label="Current Level"
                required
                error={errors.current_level}
              >
                <SelectWrapper>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={selectClass(errors.level)}
                  >
                    <option value="" disabled>
                      Select level
                    </option>
                    {[100, 200, 300, 400, 500].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl} Level
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </FormField>

              {/* Semester */}
              <FormField label="Semester" required error={errors.semester}>
                <SelectWrapper>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={selectClass(errors.semester)}
                  >
                    <option value="" disabled>
                      Select semester
                    </option>
                    {[100, 200, 300, 400, 500].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl} Level
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </FormField>

              {/* Departments */}
              <FormField
                label="Department"
                required
                error={errors.department_id}
              >
                <SelectWrapper isLoading={false}>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={selectClass(errors.department_id)}
                  >
                    <option value="">Select Department</option>
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No departments available</option>
                    )}
                  </select>
                </SelectWrapper>
              </FormField>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl gap-3">
          <p className="text-xs text-slate-400">
            <span className="text-rose-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200
                         rounded-lg hover:bg-slate-100 transition-all duration-150 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg
                         hover:bg-indigo-700 active:scale-95 transition-all duration-150
                         disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 min-w-[90px] justify-center"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Saving…" : isEditMode ? "Update" : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseModal;
