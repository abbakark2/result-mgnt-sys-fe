// src/store/auth-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    if (!token) {
      // console.log("no Token found ");
      return null;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        // console.log("no response from the server =>Auth-slice.js");
        localStorage.removeItem("ACCESS_TOKEN"); // stale/invalid token
        localStorage.removeItem("role");
        return rejectWithValue(null);
      }

      const data = await response.json();
      const role = data?.role?.name || "error role";
      return { user: data, token, role: role };
    } catch {
      // console.log("unknown error occurs in auth-slice");
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("role");
      return rejectWithValue(null);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,
    isInitialized: false,
    isLoading: false,
  },
  reducers: {
    setIsloading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      state.isAuthenticated = true;
      state.role = payload.role;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // state.isInitialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, { payload }) => {
        if (payload) {
          state.user = payload.user;
          state.token = payload.token;
          state.role = payload.role;
          state.isAuthenticated = true;
        }
        state.isInitialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isInitialized = true; // done, but unauthenticated
      });
  },
});

export const { setCredentials, logout, setIsloading } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentRole = (state) => state.auth.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsInitialized = (state) => state.auth.isInitialized;
