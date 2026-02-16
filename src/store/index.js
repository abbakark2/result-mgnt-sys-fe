import { configureStore, createSlice } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import userSlice from "./user-slice";
import facultySlice from "./faculty-slice";
import departmentSlice from "./department-slice";
import studentSlice from "./student-slice";
import { apiSlice } from "./apiSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    faculty: facultySlice.reducer,
    department: departmentSlice.reducer,
    student: studentSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
