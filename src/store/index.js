import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../app/api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./auth-slice";

// Import all injected endpoints to ensure they're registered
import "../features/auth/authApi";
import "../features/users/userApi";
import "../features/students/studentApi";
import "../features/faculties/facultyApi";
import "../features/departments/departmentApi";
import "../features/courses/courseApi";
import "../features/settings/settingsApi";

const store = configureStore({
  reducer: {
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export default store;
