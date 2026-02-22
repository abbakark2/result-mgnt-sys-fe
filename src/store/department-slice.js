import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../axios-client";

export const fetchDepartments = createAsyncThunk(
  "department/fetch", // The "Label" we discussed
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/admin/dept");
      return res.data.Departments; // This becomes the "action.payload" in fulfilled
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
  {
    // This runs BEFORE the thunk starts
    condition: (_, { getState }) => {
      const { department } = getState();
      // If we already have data or are currently loading, skip the call
      if (department.departments.length > 0 || department.isLoading) {
        return false;
      }
    },
  },
);

const departmentSlice = createSlice({
  name: "department",
  initialState: {
    isLoading: false,
    departments: [],
    error: null,
  },
  reducers: {
    // Regular reducers for manual updates (if needed)
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setDepartments(state, action) {
      state.departments = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 2. Use the Thunk object to handle the lifecycle
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const departmentActions = departmentSlice.actions;
export default departmentSlice;
