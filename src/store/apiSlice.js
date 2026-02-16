import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + "/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Students", "Faculties", "Departments", "Results", "Courses"],
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/admin/students",
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
      query: ({ id, ...updatedStudent }) => ({
        url: `/admin/students/${id}`,
        method: "PUT",
        body: updatedStudent,
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
    getFaculties: builder.query({
      query: () => "/admin/faculties",
      providesTags: ["Faculties"],
    }),
    getDepartmentsByFaculty: builder.query({
      query: (facultyId) => `/admin/faculties/${facultyId}/departments`,
      providesTags: (result, error, facultyId) => [
        { type: "Departments", id: facultyId },
      ],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetFacultiesQuery,
  useGetDepartmentsByFacultyQuery,
} = apiSlice;
