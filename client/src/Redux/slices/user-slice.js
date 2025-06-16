import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        isAuthenticated: false,
        token: null, // <-- add this
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload.user;
            state.token = action.payload.token; // <-- save token
            state.isAuthenticated = true;
        },
        removeUserData: (state) => {
            state.userData = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUserData, removeUserData } = userSlice.actions;
export const selectUserData = (state) => state.user.userData;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectToken = (state) => state.user.token; // <-- useful selector

export default userSlice.reducer;
