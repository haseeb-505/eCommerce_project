import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    accessToken: null,
    isRefreshing: false,
    isInitialCheckComplete: false,
  },
  reducers: {
    setUserInfo: (state, action) => {
      if (!action.payload) {
        console.error("No payload provided to setUserInfo");
        return state;
      }

      const { user, accessToken, isAuthenticated } = action.payload;
      if (!user || !isAuthenticated) {
        console.error("Invalid user or authentication status in payload");
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.isInitialCheckComplete = true;
        state.isRefreshing = false;
        return;
      }

      // Valid payload case
      state.user = user;
      state.isAuthenticated = true;
      state.accessToken = accessToken;
      state.isInitialCheckComplete = true;
      state.isRefreshing = false;
    },

    // refreshing state
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.isInitialCheckComplete = true;
      state.isRefreshing =  false;
    },

    setAuthCheckComplete: (state) => {
      state.isInitialCheckComplete = true;
      state.isRefreshing = false;
    },

    resetAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.isRefreshing = false;
      state.isInitialCheckComplete = true;
    }
  }
});

export const { setUserInfo, setRefreshing, logOut, setAuthCheckComplete, resetAuthState } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectCurrentUser = (state) => state.auth.user;