import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { clearUserInfo } from './authSlice.js';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  }
});

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Force re-authentication on 401 errors
    if (result.error?.status === 401 && !window.location.pathname.startsWith('/login')) {
      api.dispatch(clearUserInfo());
      window.location.href = '/login';
    }
    return result;
  },
    endpoints: (build) => ({
        registerUser: build.mutation({
            query: (formData) => ({
                url : 'auth/register',
                method : 'POST',
                body : formData,
            }),
        }),
        loginUser: build.mutation({
          query: (formData) => ({
            url: 'auth/login',
            method: 'POST',
            body: formData,
          }),
        }),
        getCurrentUser: build.query({
          query: () => ({
            url: 'auth/check-auth',
            validateStatus: (response, result) => 
              response.status === 200 && !!result.user
          }),
        }),
    })
});

// exports
export const { useRegisterUserMutation, useLoginUserMutation, useGetCurrentUserQuery } = authApi;
export default authApi;