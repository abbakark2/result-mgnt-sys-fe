import { apiSlice } from "../../app/api/apiSlice";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/admin/students",
      transformResponse: (res) => res,
      providesTags: ["Students"],
    }),
    getStudent: builder.query({
      query: (id) => ({
        url: `/student`,
        method: "GET",
        params: { id },
      }),
      transformResponse: (res) => res ?? null,
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
  }),
  overrideExisting: false,
});

export const {
  useGetStudentsQuery,
  useLazyGetStudentQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
