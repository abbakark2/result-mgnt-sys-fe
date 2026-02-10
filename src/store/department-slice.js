import { createSlice } from "@reduxjs/toolkit";

const departmentSlice = createSlice({
  name: "department",
  initialState: {
    isLoading: false,
    departments: [],
  },
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setDepartments(state, action) {
      state.departments = action.payload;
    },
  },
});

export const departmentActions = departmentSlice.actions;

export default departmentSlice;
