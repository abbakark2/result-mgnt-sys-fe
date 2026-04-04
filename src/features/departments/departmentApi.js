import { apiSlice } from "../../app/api/apiSlice";

export const departmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
  overrideExisting: false,
});

export const {
  useGetDepartmentsByFacultyQuery,
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
