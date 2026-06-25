// src/features/registration/registrationApi.js

import { apiSlice } from "../../app/api/apiSlice";


export const registrationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/registration/preview
    getRegistrationPreview: builder.query({
      query: () => "/registration/preview",
      providesTags: ["Registration"],
    }),

    // POST /api/registration
    registerCourses: builder.mutation({
      query: (courses) => ({
        url: "/registration",
        method: "POST",
        body: { courses },
      }),
      invalidatesTags: ["Registration"],
    }),

    // DELETE /api/registration/{id}
    dropCourse: builder.mutation({
      query: (registrationId) => ({
        url: `/registration/${registrationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Registration"],
    }),

    // Admin: POST /api/admin/students/{student}/registration
    adminRegisterCourses: builder.mutation({
      query: ({ studentId, courses }) => ({
        url: `/admin/students/${studentId}/registration`,
        method: "POST",
        body: { courses },
      }),
      invalidatesTags: ["Registration"],
    }),
  }),
});

export const {
  useGetRegistrationPreviewQuery,
  useRegisterCoursesMutation,
  useDropCourseMutation,
  useAdminRegisterCoursesMutation,
} = registrationApi;

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Registration"],

  endpoints: (builder) => ({
    // GET /api/registration/preview
    getRegistrationPreview: builder.query({
      query: () => "/registration/preview",
      providesTags: ["Registration"],
    }),

    // POST /api/registration
    registerCourses: builder.mutation({
      query: (courses) => ({
        url: "/registration",
        method: "POST",
        body: { courses },
      }),
      invalidatesTags: ["Registration"],
    }),

    // DELETE /api/registration/{id}
    dropCourse: builder.mutation({
      query: (registrationId) => ({
        url: `/registration/${registrationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Registration"],
    }),

    // Admin: POST /api/admin/students/{student}/registration
    adminRegisterCourses: builder.mutation({
      query: ({ studentId, courses }) => ({
        url: `/admin/students/${studentId}/registration`,
        method: "POST",
        body: { courses },
      }),
      invalidatesTags: ["Registration"],
    }),
  }),
});

export const {
  useGetRegistrationPreviewQuery,
  useRegisterCoursesMutation,
  useDropCourseMutation,
  useAdminRegisterCoursesMutation,
} = registrationApi;
