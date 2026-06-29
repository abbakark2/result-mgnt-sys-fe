import { apiSlice } from "../../app/api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    toggleCourseStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/course/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Courses"],
    }),
    getCourses: builder.query({
      query: (params) => ({
        url: "/courses",
        method: "GET",
        params: {
          search: params?.search || "",
          status: params?.status || "",
          sort: params?.sort || "",
          level: params?.level || "",
          department_id: params?.department_id || "",
        },
      }),
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
    registerCourses: builder.mutation({
      query: (body) => ({
        url: `/course/registration`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["StudentRegistrationCourse"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useToggleCourseStatusMutation,
  useGetCoursesQuery,
  useLazyGetCourseByDeptLevelQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useRegisterCoursesMutation,
} = courseApi;
