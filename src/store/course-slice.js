import api from "../services/api";

const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => "/admin/course",
      providesTags: ["Courses"],
    }),
    addCourse: builder.mutation({
      query: (newCourse) => ({
        url: "/admin/course",
        method: "POST",
        body: newCourse,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...updatedCourse }) => ({
        url: `/admin/course/${id}`,
        method: "PUT",
        body: updatedCourse,
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/admin/course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;

export default courseApi;
