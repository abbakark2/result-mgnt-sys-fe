import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { toast } from "react-toastify";
import Heading from "../components/heading";
import avatar from "../assets/images/avatar.png";
import { useGetDepartmentsQuery } from "../features/departments/departmentApi";
import { useLazyGetCourseByDeptLevelQuery } from "../features/courses/courseApi";
import { useLazyGetStudentQuery } from "../features/students/studentApi";
import { useRegisterCoursesMutation } from "../features/courses/courseApi";
import Button from "../components/button";

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_UNITS = 24;
const LEVELS = ["100", "200", "300", "400", "500"];
const SEMESTERS = ["1st", "2nd"];

/** Allowed characters for a matric number. Adjust regex to match your format. */
const MATRIC_PATTERN = /^[A-Z0-9/\-_.]+$/;
const MAX_MATRIC_LENGTH = 20;

// ─── Utility: sanitize a matric number input ──────────────────────────────────
const sanitizeMatric = (raw) => {
  // Trim whitespace, uppercase, strip any character not in the allowed set
  return raw
    .trimStart()
    .toUpperCase()
    .replace(/[^A-Z0-9/\-_.]/g, "")
    .slice(0, MAX_MATRIC_LENGTH);
};

// ─── Sub-component: Spinner ───────────────────────────────────────────────────
const Spinner = ({ size = 4 }) => (
  <svg
    className={`animate-spin h-${size} w-${size} text-current`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

// ─── Sub-component: Confirmation Modal ───────────────────────────────────────
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  student,
  courses,
  totalUnits,
  isSaving,
}) => {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-150 h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-gray-900">
                Confirm Registration
              </h2>
              <p className="text-sm text-gray-500">
                Please review before finalizing
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
            <p className="font-semibold text-gray-800">{student?.name}</p>
            <p className="text-gray-500 font-mono text-xs">
              {student?.matric_number}
            </p>
            <p className="text-gray-500">
              {student?.department} &mdash; {student?.level} Level
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Courses to Register ({courses.length})
            </p>
            <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {courses.map((c) => (
                <li
                  key={c.id}
                  className="flex justify-between items-center text-sm bg-indigo-50 px-3 py-2 rounded-lg"
                >
                  <span className="font-semibold text-indigo-900 uppercase">
                    {c.course_code}
                  </span>
                  <span className="text-indigo-400 font-mono text-xs">
                    {c.unit} units
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center bg-indigo-900 text-white rounded-xl px-4 py-3 text-sm">
            <span className="font-medium opacity-80">Total Unit Load</span>
            <span className="font-black text-lg">
              {totalUnits} / {MAX_UNITS}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={onConfirm}
            className="flex-1"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner size={4} /> Saving…
              </>
            ) : (
              "Confirm & Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-component: Student Card ──────────────────────────────────────────────
const StudentCard = ({ student }) => {
  if (!student) return null;

  const statusColor =
    student.status === "active"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-600";

  return (
    <section
      className="mt-4 flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
      aria-label="Student profile"
    >
      <img
        src={student.image || avatar}
        alt={`${student.name}'s avatar`}
        className="h-20 w-20 rounded-full border-2 border-indigo-200 object-cover shrink-0"
        onError={(e) => {
          e.currentTarget.src = avatar;
        }}
      />
      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm content-start">
        <div className="sm:col-span-2 flex items-center gap-3 mb-1">
          <p className="font-bold text-lg text-indigo-900 truncate">
            {student.name}
          </p>
          <span
            className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusColor}`}
          >
            {student.status ?? "N/A"}
          </span>
        </div>
        <DetailItem label="Matric No." value={student.matric_number} mono />
        <DetailItem label="Level" value={`${student.level} Level`} />
        <DetailItem label="Department" value={student.department} />
        <DetailItem label="Faculty" value={student.faculty} />
        <DetailItem label="Admission" value={student.admission_year} />
        <DetailItem label="Graduation" value={student.graduation_year} />
      </div>
    </section>
  );
};

const DetailItem = ({ label, value, mono = false }) => (
  <p className="text-gray-600">
    <span className="font-semibold text-gray-500">{label}: </span>
    <span className={mono ? "font-mono text-gray-800" : "text-gray-800"}>
      {value ?? "—"}
    </span>
  </p>
);

// ─── Sub-component: Course Filter Form ────────────────────────────────────────
const CourseFilterForm = ({
  onSubmit,
  formData,
  onChange,
  departments,
  isDeptLoading,
  isCourseLoading,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
      noValidate
    >
      <p className="mb-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
        Filter Available Courses
      </p>
      <div className="flex flex-wrap gap-4 items-end">
        {/* Department */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="department"
            className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500"
          >
            Department
          </label>
          <select
            id="department"
            name="department"
            required
            value={formData.department}
            onChange={onChange}
            disabled={isDeptLoading}
            className="w-full border border-gray-200 py-2.5 rounded-lg px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gray-50 disabled:opacity-60"
          >
            <option value="">Select Department</option>
            {isDeptLoading ? (
              <option disabled>Loading departments…</option>
            ) : (
              departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Semester */}
        <div className="w-36">
          <label
            htmlFor="semester"
            className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500"
          >
            Semester
          </label>
          <select
            id="semester"
            name="semester"
            required
            value={formData.semester}
            onChange={onChange}
            className="w-full border border-gray-200 py-2.5 rounded-lg px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gray-50"
          >
            <option value="">Select</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s} Semester
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div className="w-36">
          <label
            htmlFor="level"
            className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500"
          >
            Level
          </label>
          <select
            id="level"
            name="level"
            required
            value={formData.level}
            onChange={onChange}
            className="w-full border border-gray-200 py-2.5 rounded-lg px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gray-50"
          >
            <option value="">Select</option>
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl} Level
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={isCourseLoading} className="h-10 px-6">
          {isCourseLoading ? (
            <>
              <Spinner size={4} /> Fetching…
            </>
          ) : (
            "Fetch Courses"
          )}
        </Button>
      </div>
    </form>
  );
};

// ─── Sub-component: Course List Skeleton ──────────────────────────────────────
const CourseSkeleton = () => (
  <div
    className="animate-pulse space-y-2"
    aria-busy="true"
    aria-label="Loading courses"
  >
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-14 bg-gray-100 rounded-lg" />
    ))}
  </div>
);

// ─── Main Page Component ──────────────────────────────────────────────────────
function CourseRegistration() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [matricInput, setMatricInput] = useState("");
  const [matricError, setMatricError] = useState("");
  const [filterForm, setFilterForm] = useState({
    department: "",
    semester: "",
    level: "",
  });
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── API Hooks ──────────────────────────────────────────────────────────────
  const { data: departments, isLoading: isDeptLoading } =
    useGetDepartmentsQuery();

  const [
    triggerGetStudent,
    {
      data: studentData,
      error: studentError,
      isFetching: isStudentFetching,
      isUninitialized: isStudentUninitialized,
    },
  ] = useLazyGetStudentQuery();

  const [
    triggerGetCourses,
    {
      data: courseData,
      isFetching: isCourseLoading,
      isUninitialized: isCoursesUninitialized,
    },
  ] = useLazyGetCourseByDeptLevelQuery();

  const [registerCourses, { isLoading: isRegistering }] =
    useRegisterCoursesMutation();

  // ── Derived State ──────────────────────────────────────────────────────────
  const totalUnits = useMemo(
    () => selectedCourses.reduce((sum, c) => sum + (Number(c.unit) || 0), 0),
    [selectedCourses],
  );

  const isOverLimit = totalUnits > MAX_UNITS;

  // ── Effects ────────────────────────────────────────────────────────────────

  /** Reset registration state whenever the student changes */
  useEffect(() => {
    setSelectedCourses([]);
    setCheckedIds([]);
    setFilterForm({ department: "", semester: "", level: "" });
  }, [studentData?.id]);

  /** Clear stale checkbox selections when new course data arrives */
  useEffect(() => {
    setCheckedIds([]);
  }, [courseData]);

  /** Surface student-not-found and other API errors as toasts */
  useEffect(() => {
    if (!studentError) return;
    const status = studentError?.status;
    if (status === 404) {
      toast.error(
        "Student not found. Please check the matric number and try again.",
      );
    } else if (status === "FETCH_ERROR" || status >= 500) {
      toast.error(
        "Network error. Could not reach the server. Please try again.",
      );
    } else {
      toast.error(
        studentError?.data?.message ??
          "An unexpected error occurred while searching.",
      );
    }
  }, [studentError]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleMatricInputChange = useCallback(
    (e) => {
      const sanitized = sanitizeMatric(e.target.value);
      setMatricInput(sanitized);
      if (matricError) setMatricError("");
    },
    [matricError],
  );

  const handleFindStudent = useCallback(async () => {
    const trimmed = matricInput.trim();

    if (!trimmed) {
      setMatricError("Please enter a matric number.");
      return;
    }
    if (!MATRIC_PATTERN.test(trimmed)) {
      setMatricError("Invalid characters in matric number.");
      return;
    }

    setMatricError("");

    try {
      // encodeURIComponent correctly encodes '/' in matric numbers like U/CS/13/224
      await triggerGetStudent(encodeURIComponent(trimmed)).unwrap();
      toast.success("Student record loaded.");
    } catch (err) {
      // Error display is handled by the studentError useEffect above
    }
  }, [matricInput, triggerGetStudent]);

  const handleMatricKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleFindStudent();
    },
    [handleFindStudent],
  );

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilterForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFetchCourses = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const result = await triggerGetCourses({
          dept: filterForm.department,
          level: filterForm.level,
          semester: filterForm.semester,
        }).unwrap();

        if (!result || result.length === 0) {
          toast.info("No courses found for the selected filters.");
        } else {
          toast.success(`${result.length} course(s) loaded.`);
        }
      } catch {
        toast.error("Failed to load courses. Please try again.");
      }
    },
    [filterForm, triggerGetCourses],
  );

  const handleCheckboxChange = useCallback((courseId) => {
    setCheckedIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  }, []);

  const handleAddSelected = useCallback(() => {
    if (!courseData) return;

    const newCourses = courseData.filter(
      (c) =>
        checkedIds.includes(c.id) &&
        !selectedCourses.some((s) => s.id === c.id),
    );

    if (newCourses.length === 0) {
      toast.info("All selected courses are already in your registration list.");
      return;
    }

    const addedUnits = newCourses.reduce(
      (sum, c) => sum + (Number(c.unit) || 0),
      0,
    );

    if (totalUnits + addedUnits > MAX_UNITS) {
      toast.warning(
        `Adding these courses would exceed the ${MAX_UNITS}-unit limit. You have ${MAX_UNITS - totalUnits} unit(s) remaining.`,
      );
      return;
    }

    setSelectedCourses((prev) => [...prev, ...newCourses]);
    setCheckedIds([]);
    toast.success(`${newCourses.length} course(s) added to registration.`);
  }, [courseData, checkedIds, selectedCourses, totalUnits]);

  const handleRemoveCourse = useCallback((courseId) => {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== courseId));
  }, []);

  const handleOpenConfirm = useCallback(() => {
    if (selectedCourses.length === 0) {
      toast.warning("Please add at least one course before finalizing.");
      return;
    }
    if (isOverLimit) {
      toast.error(
        `Unit limit exceeded. Maximum allowed is ${MAX_UNITS} units.`,
      );
      return;
    }
    setIsModalOpen(true);
  }, [selectedCourses.length, isOverLimit]);

  const handleConfirmSave = useCallback(async () => {
    // 1. Guard Clauses (Best Practice: Early return)
    if (!studentData?.id) {
      toast.error("No student selected.");
      return;
    }
    if (selectedCourses.length === 0) {
      toast.error("Please select at least one course.");
      return;
    }

    // 2. Data Preparation
    const payload = {
      student_id: studentData.id,
      courses: selectedCourses.map((course) => {
        return {
          course_id: course.id,
          semester: course.semester?.toString().trim() || null,
        };
      }),
    };

    setIsSaving(true);

    try {
      // .unwrap() is used with RTK Query to catch errors in the 'catch' block
      await registerCourses(payload).unwrap();

      // 3. Success Actions
      toast.success(`Courses registered successfully for ${studentData.name}.`);

      // Reset UI State
      setSelectedCourses([]);
      setCheckedIds([]);
      setIsModalOpen(false);
    } catch (err) {
      // 4. ERP Standard Error Handling
      console.error("Registration error:", err);

      const errorMessage =
        err?.data?.message || "An unexpected error occurred.";
      const validationErrors = err?.data?.errors; // Laravel returns detailed errors here

      if (validationErrors) {
        // Map through multiple validation errors if they exist
        Object.values(validationErrors).forEach((errArray) =>
          errArray.forEach((msg) => toast.error(msg)),
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  }, [studentData, selectedCourses, registerCourses]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => !isSaving && setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
        student={studentData}
        courses={selectedCourses}
        totalUnits={totalUnits}
        isSaving={isSaving}
      />

      <div className="max-w-6xl mx-auto p-4 min-h-screen">
        <br />
        <Heading text="Manage student course enrollments">
          Course Registration
        </Heading>
        <br />

        <main className="space-y-6">
          {/* ── Step 1: Student Search ── */}
          <section
            className="p-6 rounded-xl shadow-sm bg-white border border-gray-200"
            aria-labelledby="student-search-heading"
          >
            <p
              id="student-search-heading"
              className="mb-3 font-semibold text-gray-700"
            >
              Student Identification
            </p>
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={matricInput}
                    onChange={handleMatricInputChange}
                    onKeyDown={handleMatricKeyDown}
                    placeholder="E.g. U/CS/13/224"
                    maxLength={MAX_MATRIC_LENGTH}
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="Student matric number"
                    aria-describedby={matricError ? "matric-error" : undefined}
                    aria-invalid={!!matricError}
                    className={`w-64 pl-4 border h-11 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase font-mono text-sm transition-all ${
                      matricError
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-200"
                    }`}
                  />
                  <Button
                    onClick={handleFindStudent}
                    disabled={isStudentFetching}
                  >
                    {isStudentFetching ? (
                      <>
                        <Spinner size={4} /> Searching…
                      </>
                    ) : (
                      "Find Student"
                    )}
                  </Button>
                </div>
                {matricError && (
                  <p
                    id="matric-error"
                    className="text-red-500 text-xs mt-0.5"
                    role="alert"
                  >
                    {matricError}
                  </p>
                )}
              </div>
            </div>

            {/* Student result area */}
            {isStudentFetching && (
              <div className="mt-4 animate-pulse flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="h-20 w-20 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2 pt-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            )}

            {!isStudentFetching && studentData && (
              <StudentCard student={studentData} />
            )}

            {!isStudentFetching && !studentData && studentError && (
              <div
                className="mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
                role="alert"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>
                  {studentError?.status === 404
                    ? `No student found with matric number "${matricInput}". Please verify and try again.`
                    : "Failed to retrieve student record. Please try again."}
                </p>
              </div>
            )}
          </section>

          {/* ── Steps 2 & 3: Only shown once a student is loaded ── */}
          {studentData && (
            <>
              {/* ── Step 2: Course Filter ── */}
              <CourseFilterForm
                onSubmit={handleFetchCourses}
                formData={filterForm}
                onChange={handleFilterChange}
                departments={departments}
                isDeptLoading={isDeptLoading}
                isCourseLoading={isCourseLoading}
              />

              {/* ── Step 3: Registration Interface ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Available Courses */}
                <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-bold text-gray-800 text-base">
                      Available Courses
                      {courseData?.length > 0 && (
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          ({courseData.length} courses)
                        </span>
                      )}
                    </h3>
                    {checkedIds.length > 0 && (
                      <Button
                        onClick={handleAddSelected}
                        variant="success"
                        className="text-xs py-1.5 h-auto"
                      >
                        + Add {checkedIds.length} Selected
                      </Button>
                    )}
                  </div>

                  <div
                    className="space-y-2"
                    role="list"
                    aria-label="Available courses"
                  >
                    {isCourseLoading ? (
                      <CourseSkeleton />
                    ) : isCoursesUninitialized ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                        <p className="text-sm">
                          Use the filters above to load available courses
                        </p>
                      </div>
                    ) : courseData?.length > 0 ? (
                      courseData.map((course) => {
                        const isAlreadyAdded = selectedCourses.some(
                          (s) => s.id === course.id,
                        );
                        return (
                          <label
                            key={course.id}
                            role="listitem"
                            className={`flex items-center gap-4 cursor-pointer p-3 rounded-lg border transition-all group ${
                              isAlreadyAdded
                                ? "bg-emerald-50 border-emerald-200 opacity-60 cursor-not-allowed"
                                : checkedIds.includes(course.id)
                                  ? "bg-indigo-50 border-indigo-300"
                                  : "hover:bg-indigo-50 border-gray-100 hover:border-indigo-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checkedIds.includes(course.id)}
                              onChange={() =>
                                !isAlreadyAdded &&
                                handleCheckboxChange(course.id)
                              }
                              disabled={isAlreadyAdded}
                              aria-label={`Select ${course.course_code}`}
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 disabled:opacity-40"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 uppercase leading-tight">
                                {course.course_code}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {course.course_title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-semibold text-gray-400 group-hover:text-indigo-500">
                                {course.unit} Units
                              </span>
                              {isAlreadyAdded && (
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                                  ADDED
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                        <p className="text-sm">
                          No courses match the selected filters
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Registration Summary (Sticky) */}
                <aside
                  className="lg:col-span-5 sticky top-6"
                  aria-label="Registration summary"
                >
                  <div className="bg-indigo-900 text-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 pb-4">
                      <h3 className="text-lg font-bold mb-4">
                        Registration Summary
                      </h3>

                      {/* Unit Progress Bar */}
                      <div className="space-y-1.5 mb-5">
                        <div className="flex justify-between text-xs font-medium uppercase tracking-tight opacity-75">
                          <span>
                            Unit Load: {totalUnits} / {MAX_UNITS}
                          </span>
                          <span
                            className={
                              isOverLimit ? "text-red-400 font-bold" : ""
                            }
                          >
                            {Math.min(
                              Math.round((totalUnits / MAX_UNITS) * 100),
                              100,
                            )}
                            %{isOverLimit && " ⚠"}
                          </span>
                        </div>
                        <div
                          className="w-full bg-indigo-950 rounded-full h-2.5 p-0.5"
                          role="progressbar"
                          aria-valuenow={totalUnits}
                          aria-valuemin={0}
                          aria-valuemax={MAX_UNITS}
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isOverLimit
                                ? "bg-red-500"
                                : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                            }`}
                            style={{
                              width: `${Math.min((totalUnits / MAX_UNITS) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Course List */}
                      <div
                        className="space-y-2 max-h-72 overflow-y-auto pr-1"
                        aria-live="polite"
                        aria-label="Selected courses"
                      >
                        {selectedCourses.length > 0 ? (
                          selectedCourses.map((course) => (
                            <div
                              key={course.id}
                              className="bg-white/10 p-3 rounded-xl flex justify-between items-center border border-white/10 group"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-bold leading-tight uppercase">
                                  {course.course_code}
                                </p>
                                <p className="text-[11px] text-indigo-300 truncate">
                                  {course.course_title}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0 ml-2">
                                <span className="text-xs font-mono font-bold text-indigo-300">
                                  {course.unit} u
                                </span>
                                <button
                                  onClick={() => handleRemoveCourse(course.id)}
                                  aria-label={`Remove ${course.course_code}`}
                                  className="text-indigo-400 hover:text-red-400 transition-colors focus:outline-none focus:ring-1 focus:ring-red-400 rounded"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 border border-white/10 rounded-xl bg-white/5">
                            <p className="text-indigo-300 text-sm italic px-4">
                              Select courses from the left panel and click "Add
                              Selected"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-5 bg-indigo-950/50 space-y-2">
                      {isOverLimit && (
                        <p
                          className="text-red-400 text-xs text-center font-bold"
                          role="alert"
                        >
                          ⚠ Unit limit exceeded — remove courses before saving
                        </p>
                      )}
                      <Button
                        onClick={handleOpenConfirm}
                        disabled={
                          selectedCourses.length === 0 ||
                          isOverLimit ||
                          isSaving
                        }
                        className="w-full bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-indigo-950 font-black uppercase tracking-widest py-3.5 rounded-xl transition-all disabled:opacity-30"
                      >
                        Finalize Registration ({selectedCourses.length})
                      </Button>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default CourseRegistration;
