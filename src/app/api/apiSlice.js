import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL + "/api",
  prepareHeaders: (headers, { getState }) => {
    const token =
      getState().auth?.token || localStorage.getItem("ACCESS_TOKEN");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/**
 * Base API slice containing the central Redux store configuration.
 * All feature-specific endpoints are injected using injectEndpoints().
 */
export const apiSlice = createApi({
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
    "academicSession",
    "CoursesDeptLevel",
  ],
  endpoints: () => ({}), // Empty - all endpoints are injected
});
