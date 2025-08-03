import {  createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:{
        userProfile:null
    },

    reducers:{
        setUser:(state,action)=>{
            // Store the entire user profile object
            state.userProfile = action.payload;
        },
        clearUser:(state)=>{
            state.userProfile=null
        }
    }
})

export const{setUser,clearUser}=userSlice.actions
export default userSlice.reducer