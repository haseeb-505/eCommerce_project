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
        }),
        loginUser: build.mutation({
          query: (formData) => ({
            url: 'auth/login',
            method: 'POST',
            body: formData,
          }),
        }),
        getCurrentUser: build.query({
          query: () => 'auth/check-auth',
        }),
    })
});

// exports
export const { useRegisterUserMutation, useLoginUserMutation, useGetCurrentUserQuery } = authApi;
export default authApi;