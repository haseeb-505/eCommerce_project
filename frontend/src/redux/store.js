import { configureStore } from '@reduxjs/toolkit';
import authApi from './Authentication/authApi.js';
import authReducer from './Authentication/authSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath] : authApi.reducer
  },
  // middleware
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
});

export default store;