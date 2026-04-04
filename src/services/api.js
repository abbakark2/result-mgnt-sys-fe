import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL + "/api",
  prepareHeaders: (headers, { getState }) => {
    const token =
      getState().auth?.token || localStorage.getItem("ACCESS_TOKEN");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Students",
    "Courses",
    "Departments",
    "Faculties",
    "Results",
    "Users",
    "Auth",
  ],
  endpoints: (builder) => ({
    // ── Auth ──────────────────────────────────────────────
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    // ── User ────────────────────────────────────────────────
    getUser: builder.query({
      query: () => "/user",
      providesTags: ["Users"],
    }),

    // ── Faculties ─────────────────────────────────────────
    getFaculties: builder.query({
      query: () => "/admin/faculties/data",
      providesTags: ["Faculties"],
      // Normalise the response shape so consumers always get an array
      transformResponse: (res) => res.Faculties ?? [],
    }),
    addFaculty: builder.mutation({
      query: (newFaculty) => ({
        url: "/admin/faculty",
        method: "POST",
        body: newFaculty,
      }),
      invalidatesTags: ["Faculties"],
    }),
    updateFaculty: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/faculty/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Faculties"],
    }),
    deleteFaculty: builder.mutation({
      query: (id) => ({ url: `/admin/faculty/${id}`, method: "DELETE" }),
      invalidatesTags: ["Faculties"],
    }),

    // ── Departments ────────────────────────────────────────
    getDepartmentsByFaculty: builder.query({
      query: (facultyId) => `/admin/faculties/${facultyId}/departments`,
      providesTags: (result, error, facultyId) => [
        { type: "Departments", id: facultyId },
      ],
    }),
    getDepartments: builder.query({
      query: () => "/admin/dept",
      transformResponse: (res) => res.data ?? [],
      providesTags: ["Departments"],
    }),
    addDepartment: builder.mutation({
      query: (newDepartment) => ({
        url: "/admin/departments",
        method: "POST",
        body: newDepartment,
      }),
      invalidatesTags: ["Departments"],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, ...updatedDepartment }) => ({
        url: `/admin/departments/${id}`,
        method: "PUT",
        body: updatedDepartment,
      }),
      invalidatesTags: ["Departments"],
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/admin/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Departments"],
    }),

    // ── Students ──────────────────────────────────────────
    getStudents: builder.query({
      query: () => "/admin/students",
      transformResponse: (res) => res.data ?? [],
      providesTags: ["Students"],
    }),
    getStudent: builder.query({
      query: (id) => ({
        url: `/student`,
        method: "GET",
        params: { id },
      }),
      transformResponse: (res) => res ?? null, // ✅ the object IS the data
      providesTags: (result, error, id) => [{ type: "Student", id }],
    }),
    addStudent: builder.mutation({
      query: (newStudent) => ({
        url: "/admin/students",
        method: "POST",
        body: newStudent,
      }),
      invalidatesTags: ["Students"],
    }),
    updateStudent: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/students/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Students"],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/admin/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),

    // COURSES
    getCourses: builder.query({
      query: () => "/courses",
      transformResponse: (res) => res.data ?? res,
      providesTags: ["Courses"],
    }),
    addCourse: builder.mutation({
      query: (newCourse) => ({
        url: "/courses",
        method: "POST",
        body: newCourse,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
    getCourseByDeptLevel: builder.query({
      query: ({ dept, level, semester }) =>
        `/${dept}/courses/${semester}/${level}`, // adjust to match your actual route
      transformResponse: (res) => {
        // console.log("TRANSFORM RAW:", res); // 👈 See exact shape before it hits component
        return res;
      },
      providesTags: ["CoursesDeptLevel"],
    }),
    getAcademicSession: builder.query({
      query: () => "/academic/session",
      transformResponse: (res) => res.data ?? res,
      providesTags: ["academicSession"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserQuery, // Added export for fetching user data
  // Students____________________________________________________________________
  useGetStudentsQuery,
  useLazyGetStudentQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  // Faculties____________________________________________________________________
  useAddFacultyMutation,
  useGetFacultiesQuery,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  // Departments__________________________________________________________________
  useGetDepartmentsByFacultyQuery,
  useAddDepartmentMutation, // Added export for adding departments
  useUpdateDepartmentMutation, // Added export for updating departments
  useDeleteDepartmentMutation, // Added export for deleting departments
  useGetDepartmentsQuery, // Added export for fetching all departments
  // Courses______________________________________________________________________
  useGetCoursesQuery,
  useLazyGetCourseByDeptLevelQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  // SETTINGS_________________________________________________________
  useGetAcademicSessionQuery,
} = api;

export default api;
