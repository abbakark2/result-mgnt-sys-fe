import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL + "/api",
  prepareHeaders: (headers, { getState }) => {
    const ACCESS_TOKEN =
      getState().auth?.ACCESS_TOKEN || localStorage.getItem("ACCESS_TOKEN");
    if (ACCESS_TOKEN) headers.set("Authorization", `Bearer ${ACCESS_TOKEN}`);
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
      providesTags: ["Courses"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useAddFacultyMutation,
  useGetFacultiesQuery,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useGetDepartmentsByFacultyQuery,
  useGetUserQuery, // Added export for fetching user data
  useAddDepartmentMutation, // Added export for adding departments
  useUpdateDepartmentMutation, // Added export for updating departments
  useDeleteDepartmentMutation, // Added export for deleting departments
  useGetDepartmentsQuery, // Added export for fetching all departments
  useGetCoursesQuery,
} = api;

export default api;
