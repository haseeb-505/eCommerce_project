import { configureStore } from '@reduxjs/toolkit';
import authApi from './authentication/authApi.js';
import authReducer from './authentication/authSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath] : authApi.reducer
  },
  // middleware
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
});

export default store;