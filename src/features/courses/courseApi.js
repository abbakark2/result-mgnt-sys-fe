import { apiSlice } from "../../app/api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
        `/${dept}/courses/${semester}/${level}`,
      transformResponse: (res) => {
        return res;
      },
      providesTags: ["CoursesDeptLevel"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCoursesQuery,
  useLazyGetCourseByDeptLevelQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
