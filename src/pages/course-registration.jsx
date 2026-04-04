import React, { useState, useEffect, useMemo } from "react";
import Heading from "../components/heading";
import Button from "../components/button";
import avatar from "../assets/images/avatar.png";
import {
  useGetDepartmentsQuery,
  useLazyGetCourseByDeptLevelQuery,
  useLazyGetStudentQuery,
} from "../services/api";

/**
 * Student Display Card
 */
const StudentCard = ({ student }) => {
  if (!student) return null;
  return (
    <section className="flex m-4 p-4 gap-4 bg-gray-50 rounded-lg border border-gray-200">
      <img
        src={student.image || avatar}
        alt="student"
        className="h-20 w-20 rounded-full border-2 border-indigo-100"
      />
      <ul className="text-sm space-y-1">
        <li className="font-bold text-lg text-indigo-900">{student.name}</li>
        <li className="text-gray-600 font-mono">{student.matric_number}</li>
        <li className="badge bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs inline-block">
          {student.level} Level
        </li>
        <li className="text-gray-700">
          <strong>Department:</strong> {student.department}
        </li>
        <li className="text-gray-700">
          <strong>Faculty:</strong> {student.faculty}
        </li>
      </ul>
    </section>
  );
};

/**
 * Course Fetching Form
 */
const GetCourseCard = ({
  onFetchCourses,
  formData,
  handleChange,
  deptLoading,
  departments,
  isCourseLoading,
}) => {
  return (
    <form
      onSubmit={onFetchCourses}
      className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm space-y-4"
    >
      <div className="flex flex-wrap gap-5 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500">
            Department
          </label>
          <select
            name="department"
            required
            value={formData.department}
            onChange={handleChange}
            className="w-full border py-2 rounded-lg px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-gray-50"
          >
            <option value="">Select Department</option>
            {deptLoading ? (
              <option>Loading...</option>
            ) : (
              departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="w-32">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500">
            Semester
          </label>
          <select
            name="semester"
            required
            value={formData.semester}
            onChange={handleChange}
            className="w-full border py-2 rounded-lg px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
          >
            <option value="">Semester</option>
            {["1st", "2nd"].map((idx) => (
              <option key={idx} value={idx}>
                {idx}
              </option>
            ))}
          </select>
        </div>

        <div className="w-32">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500">
            Level
          </label>
          <select
            name="level"
            required
            value={formData.level}
            onChange={handleChange}
            className="w-full border py-2 rounded-lg px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
          >
            <option value="">Level</option>
            {["100", "200", "300", "400", "500"].map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={isCourseLoading} className="px-8">
          {isCourseLoading ? "Fetching..." : "Fetch Courses"}
        </Button>
      </div>
    </form>
  );
};

function CourseRegistration() {
  const MAX_UNITS = 24;

  // 1. State
  const [studentIdInput, setStudentIdInput] = useState("");
  const [formData, setFormData] = useState({ department: "", level: "" });
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);

  // 2. API Hooks
  const { data: departments, isLoading: deptLoading } =
    useGetDepartmentsQuery();
  const [
    triggerGetStudent,
    { data: studentData, isFetching: isStudentLoading },
  ] = useLazyGetStudentQuery();
  const [triggerGetCourses, { data: courseData, isFetching: isCourseLoading }] =
    useLazyGetCourseByDeptLevelQuery();

  // 3. Logic: Total Units Calculation
  const totalUnits = useMemo(() => {
    return selectedCourses.reduce(
      (sum, course) => sum + (Number(course.unit) || 0),
      0,
    );
  }, [selectedCourses]);

  // 4. Handlers
  const handleGetStudent = async () => {
    if (!studentIdInput) return alert("Please enter a Student ID");
    await triggerGetStudent(encodeURI(studentIdInput)).unwrap();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFetchCourses = async (e) => {
    e.preventDefault();
    await triggerGetCourses({
      dept: formData.department,
      level: formData.level,
      semester: formData.semester,
    }).unwrap();
  };

  const handleCheckboxChange = (courseId) => {
    setCheckedIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const handleAddToRegistration = () => {
    const coursesToAdd = courseData.filter(
      (course) =>
        checkedIds.includes(course.id) &&
        !selectedCourses.some((selected) => selected.id === course.id),
    );

    const unitsToAdd = coursesToAdd.reduce(
      (sum, c) => sum + (Number(c.unit) || 0),
      0,
    );
    if (totalUnits + unitsToAdd > MAX_UNITS) {
      return alert(
        `Unit limit exceeded! You can only add ${MAX_UNITS - totalUnits} more units.`,
      );
    }

    setSelectedCourses((prev) => [...prev, ...coursesToAdd]);
    setCheckedIds([]);
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const onSaveToDatabase = () => {
    alert(
      `Registering ${selectedCourses.length} courses for ${studentData.name}`,
    );
    console.log(selectedCourses);
    console.log(studentData);

    // Trigger your POST mutation here
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gray-50/50">
      <br />
      <Heading text={"Manage student enrollments"}>Course Registration</Heading>
      <br />

      <main className="space-y-6">
        {/* Step 1: Student Search */}
        <section className="p-6 rounded-xl shadow-sm bg-white border border-gray-200">
          <p className="mb-3 font-semibold text-gray-700">
            Student Identification
          </p>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value.toUpperCase())}
              placeholder="E.g. U/CS/13/224"
              className="flex-1 max-w-sm pl-4 border h-11 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono transition-all"
            />
            <Button onClick={handleGetStudent} disabled={isStudentLoading}>
              {isStudentLoading ? "Searching..." : "Find Student"}
            </Button>
          </div>
          {studentData && <StudentCard student={studentData} />}
        </section>

        {studentData && (
          <>
            {/* Step 2: Course Filter */}
            <GetCourseCard
              onFetchCourses={onFetchCourses}
              formData={formData}
              handleChange={handleChange}
              departments={departments}
              deptLoading={deptLoading}
              isCourseLoading={isCourseLoading}
            />

            {/* Step 3: Registration Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Available Courses */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800 text-lg">
                    Available Courses
                  </h3>
                  {checkedIds.length > 0 && (
                    <Button
                      onClick={handleAddToRegistration}
                      className="bg-green-600 hover:bg-green-700 text-xs py-1.5 h-auto"
                    >
                      Add {checkedIds.length} Selected
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  {isCourseLoading ? (
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 bg-gray-100 rounded"></div>
                      ))}
                    </div>
                  ) : courseData?.length > 0 ? (
                    courseData.map((course) => (
                      <label
                        key={course.id}
                        className="flex items-center gap-4 cursor-pointer p-3 rounded-lg hover:bg-indigo-50 border border-gray-100 transition-all group"
                      >
                        <input
                          type="checkbox"
                          checked={checkedIds.includes(course.id)}
                          onChange={() => handleCheckboxChange(course.id)}
                          className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800 uppercase">
                            {course.course_code}
                          </p>
                          <p className="text-sm text-gray-600">
                            {course.course_title}
                          </p>
                        </div>
                        <div className="text-xs font-semibold text-gray-400 group-hover:text-indigo-600">
                          {course.unit} Units
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed rounded-xl text-gray-400">
                      Use the filters above to load courses
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Selected Bucket (Sticky) */}
              <aside className="lg:col-span-5 sticky top-6">
                <div className="bg-indigo-900 text-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-6 pb-4">
                    <h3 className="text-xl font-bold mb-4">
                      Registration Summary
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-medium uppercase tracking-tighter opacity-80">
                        <span>
                          Units Load: {totalUnits} / {MAX_UNITS}
                        </span>
                        <span>
                          {Math.round((totalUnits / MAX_UNITS) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-indigo-950 rounded-full h-3 p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${totalUnits > MAX_UNITS ? "bg-red-500" : "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"}`}
                          style={{
                            width: `${Math.min((totalUnits / MAX_UNITS) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-100 overflow-y-auto custom-scrollbar pr-1">
                      {selectedCourses.length > 0 ? (
                        selectedCourses.map((course) => (
                          <div
                            key={course.id}
                            className="bg-white/10 backdrop-blur-sm p-3 rounded-xl flex justify-between items-center border border-white/10 group"
                          >
                            <div>
                              <p className="text-sm font-bold leading-tight">
                                {course.course_code}
                              </p>
                              <p className="text-[11px] text-indigo-200 line-clamp-1">
                                {course.course_title}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-indigo-300">
                                {course.unit} Units
                              </span>
                              <button
                                onClick={() => handleRemoveCourse(course.id)}
                                className="text-indigo-400 hover:text-red-400 transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
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
                        <div className="text-center py-12 border border-white/5 rounded-xl bg-white/5">
                          <p className="text-indigo-300 text-sm italic px-4">
                            Click "Add" on available courses to build your
                            registration
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-indigo-950/50 mt-4">
                    <Button
                      onClick={onSaveToDatabase}
                      disabled={
                        selectedCourses.length === 0 || totalUnits > MAX_UNITS
                      }
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-indigo-950 font-black uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-30"
                    >
                      Finalize Registration
                    </Button>
                    {totalUnits > MAX_UNITS && (
                      <p className="text-red-400 text-[10px] mt-2 text-center font-bold">
                        ⚠️ UNIT LIMIT EXCEEDED
                      </p>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default CourseRegistration;
