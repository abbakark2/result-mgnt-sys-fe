import { configureStore, createSlice } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import userSlice from "./user-slice";
import facultySlice from "./faculty-slice";
import departmentSlice from "./department-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    faculty: facultySlice.reducer,
    department: departmentSlice.reducer,
  },
});

export default store;
