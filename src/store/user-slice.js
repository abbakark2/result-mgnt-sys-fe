import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoading: false,
        userData: [],
    },
    reducers:{
        setUserData(state, action){
            state.userData = action.payload;
        },
        setIsLoading(state,action){
            state.isLoading = action.payload;
        }
    }
});

export const userActions = userSlice.actions;

export default userSlice;