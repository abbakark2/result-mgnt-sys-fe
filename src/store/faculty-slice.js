import { api } from "../services/api";

const facultyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFaculties: builder.query({
      query: () => "/admin/faculties",
      providesTags: ["Faculties"],
    }),
    addFaculty: builder.mutation({
      query: (newFaculty) => ({
        url: "/admin/faculties",
        method: "POST",
        body: newFaculty,
      }),
      invalidatesTags: ["Faculties"],
    }),
    updateFaculty: builder.mutation({
      query: ({ id, ...updatedFaculty }) => ({
        url: `/admin/faculties/${id}`,
        method: "PUT",
        body: updatedFaculty,
      }),
      invalidatesTags: ["Faculties"],
    }),
    deleteFaculty: builder.mutation({
      query: (id) => ({
        url: `/admin/faculties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faculties"],
    }),
  }),
});

export const {
  useGetFacultiesQuery,
  useAddFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} = facultyApi;

export default facultyApi;
