import { apiSlice } from "../../app/api/apiSlice";

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicSession: builder.query({
      query: () => "/academic/session",
      transformResponse: (res) => res.data ?? res,
      providesTags: ["academicSession"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAcademicSessionQuery } = settingsApi;
