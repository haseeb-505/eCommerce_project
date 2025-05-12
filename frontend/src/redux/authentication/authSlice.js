import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
    },
    reducers:{ // reducers are basically our actions which we want to perform
        // since reducers are actions, and actions are basically functions
        setUserInfo: (state, action) => {
            if (!action.payload) {
                console.error("No payload provided to setUserInfo");
                return;
            }
            console.log('Dispatching setUserInfo:', action.payload);

            const userData = action.payload?.user || action.payload;
        
            if (!userData) {
                console.error("Invalid user data in payload");
                state.error = "Invalid user data";
                return;
            }

            state.user = userData;
            state.isAuthenticated = true;
        },
        
        clearUserInfo: (state, action) => {
            state.user = null
            state.isAuthenticated = false
        }

    }
});

export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;
