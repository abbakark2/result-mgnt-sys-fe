// src/features/registration/RegistrationPage.jsx

import { useState, useMemo } from "react";
import {
  useGetRegistrationPreviewQuery,
  useRegisterCoursesMutation,
  useDropCourseMutation,
} from "./registrationApi";
import CourseTag from "./components/CourseTag";
import UnitMeter from "./components/UnitMeter";
import CourseSearchModal from "./components/CourseSearchModal";

export default function RegistrationPage() {
  const { data, isLoading, isError } = useGetRegistrationPreviewQuery();
  const [registerCourses, { isLoading: isRegistering }] =
    useRegisterCoursesMutation();
  const [dropCourse, { isLoading: isDropping }] = useDropCourseMutation();

  // Courses the student has selected but not yet submitted
  const [pending, setPending] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const preview = data?.data;

  // Pre-select all suggested courses on first load
  // (run once when preview arrives)
  const [initialised, setInitialised] = useState(false);
  if (preview && !initialised) {
    const suggested = [
      ...(preview.suggested_current ?? []),
      ...(preview.suggested_carryover ?? []),
    ];
    setPending(suggested);
    setInitialised(true);
  }

  const pendingUnits = useMemo(
    () => pending.reduce((sum, c) => sum + c.unit, 0),
    [pending],
  );

  const totalUnits = (preview?.registered_units ?? 0) + pendingUnits;
  const isOverLimit = totalUnits > 24;

  const alreadyRegisteredIds = useMemo(
    () => (preview?.already_registered ?? []).map((r) => r.course_id),
    [preview],
  );

  const pendingIds = pending.map((c) => c.id);

  // All courses available to search — everything not already confirmed or pending
  const searchableCourses = useMemo(() => {
    if (!preview) return [];
    return [
      ...(preview.suggested_current ?? []),
      ...(preview.suggested_carryover ?? []),
    ].filter(
      (c) => !pendingIds.includes(c.id) && !alreadyRegisteredIds.includes(c.id),
    );
  }, [preview, pendingIds, alreadyRegisteredIds]);

  function addToPending(course) {
    if (!pendingIds.includes(course.id)) {
      setPending((prev) => [...prev, course]);
    }
  }

  function removeFromPending(course) {
    setPending((prev) => prev.filter((c) => c.id !== course.id));
  }

  async function handleSubmit() {
    if (pending.length === 0) return;
    setErrorMsg("");
    setSuccessMsg("");

    const carryoverIds = (preview?.suggested_carryover ?? []).map((c) => c.id);

    const payload = pending.map((course) => ({
      course_id: course.id,
      is_carryover: carryoverIds.includes(course.id),
    }));

    try {
      await registerCourses(payload).unwrap();
      setSuccessMsg("Courses registered successfully.");
      setPending([]);
      setInitialised(false); // re-initialise on next preview load
    } catch (err) {
      setErrorMsg(
        err?.data?.message ?? "Registration failed. Please try again.",
      );
    }
  }

  async function handleDrop(registrationId) {
    setErrorMsg("");
    try {
      await dropCourse(registrationId).unwrap();
    } catch (err) {
      setErrorMsg(err?.data?.message ?? "Failed to drop course.");
    }
  }

  // ----------------------------------------------------------------
  // RENDER STATES
  // ----------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading your registration preview...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Failed to load registration data. Please refresh the page.
      </div>
    );
  }

  const alreadyRegistered = preview?.already_registered ?? [];
  const suggestedCurrent = preview?.suggested_current ?? [];
  const suggestedCarryover = preview?.suggested_carryover ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Course Registration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {preview?.session?.name} — {preview?.session?.current_semester}{" "}
          Semester
        </p>
      </div>

      {/* Credit Unit Meter */}
      <UnitMeter
        registeredUnits={preview?.registered_units ?? 0}
        pendingUnits={pendingUnits}
      />

      {/* Feedback */}
      {successMsg && (
        <div
          className="bg-green-50 border border-green-200 text-green-700 
                                rounded-lg px-4 py-3 text-sm"
        >
          ✓ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 
                                rounded-lg px-4 py-3 text-sm"
        >
          ⚠ {errorMsg}
        </div>
      )}

      {/* ── SECTION 1: Already Registered ── */}
      {alreadyRegistered.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-semibold text-gray-700">
              Already Registered
            </h2>
            <span
              className="text-xs bg-green-100 text-green-700 
                                         rounded-full px-2 py-0.5"
            >
              {alreadyRegistered.length} course
              {alreadyRegistered.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alreadyRegistered.map((reg) => (
              <div key={reg.id} className="relative">
                <CourseTag
                  course={reg.course}
                  disabled={isDropping}
                  onRemove={() => handleDrop(reg.id)}
                />
                {reg.is_carryover && (
                  <span
                    className="absolute -top-2 -right-2 text-xs 
                                                     bg-amber-400 text-white rounded-full 
                                                     px-1.5 py-0.5 leading-none"
                  >
                    CO
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SECTION 2: Courses to Register ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-700">
              Courses to Register
            </h2>
            {pending.length > 0 && (
              <span
                className="text-xs bg-blue-100 text-blue-700 
                                             rounded-full px-2 py-0.5"
              >
                {pending.length} selected
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add course
          </button>
        </div>

        {/* Carryover notice */}
        {suggestedCarryover.length > 0 && (
          <p
            className="text-xs text-amber-600 bg-amber-50 border border-amber-200 
                                  rounded-lg px-3 py-2 mb-3"
          >
            ⚠ Courses marked <strong>CO</strong> are detected carryovers from
            previous sessions.
          </p>
        )}

        {pending.length === 0 ? (
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl 
                                    py-10 text-center text-gray-400 text-sm"
          >
            No courses selected. Click <strong>+ Add course</strong> to add
            manually.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pending.map((course) => {
              const isCarryover = suggestedCarryover.some(
                (c) => c.id === course.id,
              );
              return (
                <div key={course.id} className="relative">
                  <CourseTag
                    course={course}
                    onRemove={removeFromPending}
                    disabled={isRegistering}
                  />
                  {isCarryover && (
                    <span
                      className="absolute -top-2 -right-2 text-xs 
                                                         bg-amber-400 text-white rounded-full 
                                                         px-1.5 py-0.5 leading-none"
                    >
                      CO
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Submit Button */}
      {pending.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isRegistering || isOverLimit}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl 
                                   font-medium text-sm hover:bg-blue-700 
                                   disabled:opacity-50 disabled:cursor-not-allowed 
                                   transition-colors"
          >
            {isRegistering
              ? "Registering..."
              : `Register ${pending.length} Course${pending.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CourseSearchModal
          availableCourses={[...suggestedCurrent, ...suggestedCarryover]}
          selectedIds={[...pendingIds, ...alreadyRegisteredIds]}
          onAdd={addToPending}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
