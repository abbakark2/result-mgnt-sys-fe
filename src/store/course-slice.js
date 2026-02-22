import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../axios-client";

export const fetchCourses = createAsyncThunk(
  "course/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/admin/course");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "fetching courses failed",
      );
    }
  },
);

const courseSlice = createSlice({
  name: "course",
  initialState: {
    courses: [],
    iscourseLoading: false, // Add isLoading to the initial state
  },
  reducers: {
    setCourses(state, action) {
      state.courses = action.payload;
    },
    setiscourseLoading(state, action) {
      state.iscourseLoading = action.payload;
    },
  },
});

export const courseActions = courseSlice.actions;
export default courseSlice;
