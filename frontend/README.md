# React + Vite

## react-redux and reduc-toolkit usage
To install required libraries, run this in terminal
```bash
npm install @reduxjs/toolkit react-redux
```
### Store setup:
```js
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {}, // this will be populated by reducers we'll build in different functionalities.
    // in present case, we'll be working on authReducer and authApi
    // authSlice returns: reducer and actions
    // authApi returns: reducer and hooks
})
```

### authApi.js
`createApi` takes objects with 3 properties, namely, `reducerPath`, `baseQuery` and `endpoints`
    * `reducerPath` takes the endPoint  
    * `baseQuery` takes object with properties `baseUrl` (the basic url path of our app) and `credentials` (to decide whether to send credentials or not)
    * `endpoints` 

```js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000',
        credentials: 'include',
    }),
    endpoints: (build) => ({
        registerUser: build.mutation({
            query: (data) => {
                url = 'auth/register',
                method = 'POST',
                body = data
            }
        }),
        loginUser: build.mutation({
            query:(data) => {
                url = 'auth/login',
                method = 'POST',
                body = data
            }
        })
    })
});

// exports
export const { useRegisterUserMutation, useLoginUserMutation } = authApi;
export default authApi;
```
### authSlice.js (imported as authReducer)

```js
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
    },
    reducers:{ // reducers are basically our actions which we want to perform
        // since reducers are actions, and actions are basically functions
        setUserInfo: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        
        clearUserInfo: (state, action) => {
            state.user = null
            state.token = null
        }

    }
});

export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;
```



