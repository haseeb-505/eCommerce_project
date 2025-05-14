import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './authentication/apiSlice.js';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from "./authentication/authSlice.js";


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  }, 
  // middleware
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;