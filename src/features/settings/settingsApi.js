import { apiSlice } from "../../app/api/apiSlice";

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicSession: builder.query({
      query: () => "/academic/session",
      transformResponse: (res) => res.data ?? res,
      providesTags: ["academicSession"],
    }),
    toggleAcademicSessionStatus: builder.mutation({
      query: (id) => ({
        url: `/academic/session/${id}/toggle`,
        method: "PUT",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically update cache for all sessions
        const patchResult = dispatch(
          settingsApi.util.updateQueryData(
            "getAcademicSession",
            undefined,
            (draft) => {
              const targetSession = draft.find((s) => s.id === id);
              if (targetSession) {
                const wasActive = targetSession.is_active;
                // If activating, deactivate others
                if (!wasActive) {
                  draft.forEach((session) => {
                    if (session.id !== id) {
                      session.is_active = false;
                    }
                  });
                }
                // Toggle target session
                targetSession.is_active = !wasActive;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["academicSession"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAcademicSessionQuery,
  useToggleAcademicSessionStatusMutation,
} = settingsApi;
