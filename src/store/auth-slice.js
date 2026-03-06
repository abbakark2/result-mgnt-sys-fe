import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("ACCESS_TOKEN"),
  },
  reducers: {
    login(state, action) {
      state.token = action.payload; // Ensure Redux state is updated
      localStorage.setItem("ACCESS_TOKEN", action.payload);
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem("ACCESS_TOKEN");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
