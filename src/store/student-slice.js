import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
  name: "student",
  initialState: {
    isLoading: false,
    students: [],
  },
  reducers: {
    setStudents(state, action) {
      state.students = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const studentActions = studentSlice.actions;

export default studentSlice;
