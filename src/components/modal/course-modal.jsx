import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { X, Loader2, ChevronDown, Search, AlertCircle } from "lucide-react";
import {
  useGetFacultiesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
} from "../../services/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  course_code: "",
  course_title: "",
  unit: "",
  level: "",
  semester: "",
  faculty_id: "",
  department_id: "",
};

const VALIDATORS = {
  course_code: (v) =>
    !v?.trim()
      ? "Course code is required"
      : !/^[A-Za-z]{2,4}\d{3}$/i.test(v.trim())
        ? "Format must be e.g. CSC101 or GST123"
        : "",
  course_title: (v) =>
    !v?.trim()
      ? "Course title is required"
      : v.trim().length < 3
        ? "Must be at least 3 characters"
        : "",
  unit: (v) => (!v ? "Credit unit is required" : ""),
  level: (v) => (!v ? "Level is required" : ""),
  semester: (v) => (!v ? "Semester is required" : ""),
  faculty_id: (v) => (!v ? "Faculty is required" : ""),
  department_id: (v) => (!v ? "Department is required" : ""),
};

// ─── FieldError ───────────────────────────────────────────────────────────────

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────

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

// ─── Shared class helpers ─────────────────────────────────────────────────────

const inputBase = (hasError) =>
  `w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-lg outline-none transition-all duration-200
   placeholder:text-slate-400 text-slate-800
   focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
   disabled:opacity-50 disabled:cursor-not-allowed
   ${
     hasError
       ? "border-rose-400 bg-rose-50/30 focus:ring-rose-500/20 focus:border-rose-400"
       : "border-slate-200 hover:border-slate-300"
   }`;

const selectBase = (hasError) =>
  `${inputBase(hasError)} appearance-none cursor-pointer pr-9`;

// ─── SelectWrapper ────────────────────────────────────────────────────────────

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

// ─── DepartmentCombobox ───────────────────────────────────────────────────────
// Searchable input that filters available departments and lets user click-select.

function DepartmentCombobox({
  departments,
  value,
  onChange,
  onBlur,
  hasError,
  disabled,
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Derive display label from current department_id value
  const selectedDept = departments.find((d) => String(d.id) === String(value));

  // Keep input text in sync with selected value when it changes externally (edit mode)
  useEffect(() => {
    if (selectedDept) {
      setQuery(selectedDept.name);
    } else {
      setQuery("");
    }
  }, [value, departments]);

  const filtered = query
    ? departments.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase()),
      )
    : departments;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        // If user typed but didn't select — revert to the last valid selection label
        if (selectedDept) setQuery(selectedDept.name);
        else setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedDept]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    // If user clears the input, clear the selection too
    if (!e.target.value) onChange("");
  };

  const handleSelect = (dept) => {
    setQuery(dept.name);
    onChange(dept.id);
    setIsOpen(false);
  };

  const handleInputBlur = () => {
    // Delay so click on dropdown item fires first
    setTimeout(() => {
      if (!isOpen) onBlur?.();
    }, 150);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleInputBlur}
          disabled={disabled}
          placeholder={
            disabled ? "Select a faculty first" : "Search department…"
          }
          className={`${inputBase(hasError)} pl-8 pr-9`}
          autoComplete="off"
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            setIsOpen((o) => !o);
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown list */}
      {isOpen && !disabled && (
        <ul
          className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg
                     max-h-48 overflow-y-auto py-1 text-sm"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-slate-400 italic">
              No departments found
            </li>
          ) : (
            filtered.map((dept) => (
              <li
                key={dept.id}
                onMouseDown={() => handleSelect(dept)}
                className={`px-3 py-2 cursor-pointer transition-colors
                  ${
                    String(dept.id) === String(value)
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {dept.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

// ─── CourseModal ──────────────────────────────────────────────────────────────

function CourseModal({
  isOpen,
  onClose,
  initialData,
  handleSubmit: onSubmitSuccess,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { data: faculties = [], isLoading: isFacultiesLoading } =
    useGetFacultiesQuery();

  const [addCourse, { isLoading: isAdding }] = useAddCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const isSubmitting = isAdding || isUpdating;
  const isEditMode = Boolean(initialData?.id);

  // Departments filtered by selected faculty
  const selectedFaculty = faculties.find(
    (f) => String(f.id) === String(formData.faculty_id),
  );
  const availableDepartments = selectedFaculty?.departments ?? [];

  // ── Populate / reset form on open ────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode) {
      // Infer faculty_id from department.faculty_id nested in the response
      const inferredFacultyId = initialData.department?.faculty_id ?? "";
      setFormData({
        course_code: initialData.course_code ?? "",
        course_title: initialData.course_title ?? "",
        unit: initialData.unit ?? "",
        level: initialData.level ?? "",
        semester: initialData.semester ?? "",
        faculty_id: inferredFacultyId,
        department_id: initialData.department_id ?? "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }

    setErrors({});
    setTouched({});
  }, [isOpen, initialData]);

  // ── Lock body scroll ──────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Validation ────────────────────────────────────────────────────────────

  const validateField = useCallback((name, value) => {
    const validator = VALIDATORS[name];
    const error = validator ? validator(value) : "";
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  }, []);

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    Object.entries(VALIDATORS).forEach(([field, validator]) => {
      const error = validator(formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    setTouched(
      Object.keys(VALIDATORS).reduce((acc, k) => ({ ...acc, [k]: true }), {}),
    );
    return isValid;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "faculty_id") {
      // Reset department when faculty changes
      setFormData((prev) => ({
        ...prev,
        faculty_id: value,
        department_id: "",
      }));
      if (touched.faculty_id) validateField("faculty_id", value);
      if (touched.department_id) validateField("department_id", "");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handleDepartmentChange = (deptId) => {
    setFormData((prev) => ({ ...prev, department_id: deptId }));
    if (touched.department_id) validateField("department_id", deptId);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleDepartmentBlur = () => {
    setTouched((prev) => ({ ...prev, department_id: true }));
    validateField("department_id", formData.department_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    // Strip faculty_id — it's UI-only, not sent to API
    const { faculty_id, ...payload } = formData;

    try {
      if (isEditMode) {
        const res = await updateCourse({
          id: initialData.id,
          ...payload,
        }).unwrap();
        toast.success(res.message ?? "Course updated successfully");
      } else {
        const res = await addCourse(payload).unwrap();
        toast.success(res.message ?? "Course added successfully");
      }
      onSubmitSuccess?.();
      onClose();
    } catch (err) {
      // Surface Laravel field validation errors inline
      const serverErrors = err?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const flattened = Object.entries(serverErrors).reduce(
          (acc, [field, messages]) => ({
            ...acc,
            [field]: Array.isArray(messages) ? messages[0] : messages,
          }),
          {},
        );
        setErrors(flattened);
        toast.error("Please fix the errors highlighted below.");
      } else {
        toast.error(err?.data?.message ?? "An error occurred while saving.");
      }
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Panel */}
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl shadow-slate-900/20 flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {isEditMode ? "Edit Course" : "Add New Course"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditMode
                ? "Update the course details below."
                : "Fill in the details to register a new course."}
            </p>
          </div>
          <button
            type="button"
            onClick={!isSubmitting ? onClose : undefined}
            disabled={isSubmitting}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Course Code */}
            <FormField label="Course Code" required error={errors.course_code}>
              <input
                type="text"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. CSC101"
                className={inputBase(errors.course_code)}
              />
            </FormField>

            {/* Course Title */}
            <FormField
              label="Course Title"
              required
              error={errors.course_title}
            >
              <input
                type="text"
                name="course_title"
                value={formData.course_title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Introduction to Computer Science"
                className={inputBase(errors.course_title)}
              />
            </FormField>

            {/* Credit Unit */}
            <FormField label="Credit Unit" required error={errors.unit}>
              <SelectWrapper>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={selectBase(errors.unit)}
                >
                  <option value="" disabled>
                    Select unit
                  </option>
                  {[1, 2, 3, 4, 5, 6].map((u) => (
                    <option key={u} value={u}>
                      {u} Unit{u > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </SelectWrapper>
            </FormField>

            {/* Level */}
            <FormField label="Level" required error={errors.level}>
              <SelectWrapper>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={selectBase(errors.level)}
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
                  className={selectBase(errors.semester)}
                >
                  <option value="" disabled>
                    Select semester
                  </option>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                </select>
              </SelectWrapper>
            </FormField>

            {/* Faculty */}
            <FormField label="Faculty" required error={errors.faculty_id}>
              <SelectWrapper isLoading={isFacultiesLoading}>
                <select
                  name="faculty_id"
                  value={formData.faculty_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isFacultiesLoading}
                  className={selectBase(errors.faculty_id)}
                >
                  <option value="" disabled>
                    {isFacultiesLoading ? "Loading…" : "Select faculty"}
                  </option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </SelectWrapper>
            </FormField>

            {/* Department — searchable combobox, spans full width */}
            <div className="sm:col-span-2">
              <FormField
                label="Department"
                required
                error={errors.department_id}
              >
                <DepartmentCombobox
                  departments={availableDepartments}
                  value={formData.department_id}
                  onChange={handleDepartmentChange}
                  onBlur={handleDepartmentBlur}
                  hasError={!!errors.department_id}
                  disabled={!formData.faculty_id}
                />
                {formData.faculty_id && availableDepartments.length === 0 && (
                  <p className="mt-1 text-xs text-amber-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    No departments found for this faculty.
                  </p>
                )}
              </FormField>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
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
                         rounded-lg hover:bg-slate-100 transition-all disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg
                         hover:bg-indigo-700 active:scale-95 transition-all
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center gap-2 min-w-25 justify-center"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting
                ? "Saving…"
                : isEditMode
                  ? "Update Course"
                  : "Add Course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseModal;
