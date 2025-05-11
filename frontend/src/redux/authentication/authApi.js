import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/v1',
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            // Do not set Content-Type if uploading files
            return headers;
        }
    }),
    endpoints: (build) => ({
        registerUser: build.mutation({
            query: (formData) => ({
                url : 'auth/register',
                method : 'POST',
                body : formData,
            }),
            transformResponse: (response) => {
                // Standardize the response structure
                return {
                  success: true,
                  data: response,
                  message: "Registration successful"
                };
              },
              transformErrorResponse: (response) => {
                // Standardize error responses
                return {
                  success: false,
                  error: response.data?.message || "Registration failed",
                  status: response.status
                };
              }
        }),
        loginUser: build.mutation({
            query:(formData) => ({
                url : 'auth/login',
                method : 'POST',
                body : formData
            }),
            transformResponse: (response) => {
                // Standardize the response structure
                return {
                  success: true,
                  data: response,
                  message: "Login successful"
                };
              },
              transformErrorResponse: (response) => {
                // Standardize error responses
                return {
                  success: false,
                  error: response.data?.message || "Login failed",
                  status: response.status
                };
              }
        }),
        getCurrentUser: build.query({
          query: () => ({
            url: 'auth/check-auth', 
            method: 'GET',
          }),
          transformResponse: (response) => {
            return {
              authenticated: true,
              user: response.data || null
            };
          },
          transformErrorResponse: (response) => {
            return {
              authenticated: false,
              user: null,
              error: response.data?.message || "Not authenticated"
            };
          },
        })
    })
});

// exports
export const { useRegisterUserMutation, useLoginUserMutation, useGetCurrentUserQuery } = authApi;
export default authApi;