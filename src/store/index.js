import { configureStore } from "@reduxjs/toolkit";
import api from "../services/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./auth-slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export default store;
