import { apiSlice } from "../../app/api/apiSlice";

export const facultyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFaculties: builder.query({
      query: () => "/admin/faculties/data",
      providesTags: ["Faculties"],
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
  }),
  overrideExisting: false,
});

export const {
  useGetFacultiesQuery,
  useAddFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} = facultyApi;
