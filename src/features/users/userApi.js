import { apiSlice } from "../../app/api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/user",
      providesTags: ["Users"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserQuery } = userApi;
