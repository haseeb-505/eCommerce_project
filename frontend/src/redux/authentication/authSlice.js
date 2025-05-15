import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    accessToken: null
  },
  reducers: {
    setUserInfo: (state, action) => {
      if (!action.payload) {
        console.error("No payload provided to setUserInfo");
        return;
      }

      // console.log("payload is: ", action.payload);

      const { user, accessToken, isAuthenticated } = action.payload;

      if (!user) {
        console.error("Invalid user in payload");
        state.error = "Invalid user";
        return;
      }

      state.user = user;
      state.isAuthenticated = isAuthenticated !== undefined ? isAuthenticated : true;
      state.accessToken = accessToken;
    },
    
    // setCredentials: (state, action) => {
    //   const { accessToken } = action.payload;
    //   state.token = accessToken;
    // },
    
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
    }
  }
});

export const { setUserInfo, clearUserInfo, setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectCurrentUser = (state) => state.auth.user;