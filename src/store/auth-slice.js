import { createSlice } from "@reduxjs/toolkit";

const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN");

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        ACCESS_TOKEN: localStorage.getItem("ACCESS_TOKEN"),
    },
    reducers:{
        login(state, action){
            state.ACCESS_TOKEN = action.payload;
        },
        logout(state){
            state.ACCESS_TOKEN = null;
            localStorage.removeItem("ACCESS_TOKEN");
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice;