import { apiSlice } from './apiSlice.js';
import { logOut, setUserInfo, setAuthCheckComplete, resetAuthState } from './authSlice.js';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      }),
      transformResponse: (response) => {
        return {
          user: response.data.user,
          accessToken: response.data.accessToken,
          isAuthenticated: true
        }
      },
        // Add this to automatically dispatch setUserInfo
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserInfo(data));
        } catch (error) {
          console.log('Login error:', error);
        }
      }
    }),
    register: builder.mutation({
      query: credentials => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials
      })
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log('Logout error:', err);
        }
      }
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: (response) => {
        // console.log('Refresh response:', JSON.stringify(response, null, 2));
        if (response?.data) {
          return {
            user: response.data.user,
            accessToken: response.data.accessToken,
            isAuthenticated: true
          };
        }
        console.warn('No valid data in refresh response');
        return {
          user: null,
          accessToken: null,
          isAuthenticated: false
        };
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error('Refresh error:', JSON.stringify(response, null, 2));
        if (typeof response.data === 'string' && response.data.startsWith('<!DOCTYPE html>')) {
          return {
            status: 'UNAUTHORIZED',
            data: { message: 'Session expired. Please login again.' },
          };
        }
        return {
          status: response.status || 'UNKNOWN',
          data: response.data || { message: 'Authentication failed' },
          originalError: response
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user && data?.accessToken) {
            dispatch(setUserInfo(data));
          }
          dispatch(setAuthCheckComplete());
        } catch (error) {
          console.error('Refresh query error:', JSON.stringify(error, null, 2));
          dispatch(setAuthCheckComplete());
        }
      }
    }),
    checkLoginStatus: builder.mutation({
      query: () => ({
        url: '/auth/check-login-status',
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: (response) => {
        // console.log('Check-login-status response:', JSON.stringify(response, null, 2));
        return {
          isLoggedIn: response.data.isLoggedIn || false,
        };
      },
      transformErrorResponse: (response) => {
        console.log('Check-login-status error:', JSON.stringify(response, null, 2));
        return {
          status: response.status,
          data: { isLoggedIn: false },
          isInitialCheckComplete: true,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setAuthCheckComplete());
        } catch (error) {
          console.log('Check-login-status query error:', JSON.stringify(error, null, 2));
          dispatch(setAuthCheckComplete());
        }
      },
    }),
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useCheckLoginStatusMutation
} = authApiSlice;

export default authApiSlice;