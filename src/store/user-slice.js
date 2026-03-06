import { api } from "../services/api";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "/admin/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updatedUser }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

export default userApi;
