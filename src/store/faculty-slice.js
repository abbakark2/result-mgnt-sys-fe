import { createSlice } from "@reduxjs/toolkit";

const facultySlice = createSlice({
    name: "fac",
    initialState:{
        isLoading:false,
        faculties: [],
    },
    reducers:{
        setIsLoading(state, action){
            state.isLoading = action.payload;
        },
        setFaculties(state, action){
            state.faculties = action.payload;
        }
    }
});

export const facultyActions = facultySlice.actions;

export default facultySlice;