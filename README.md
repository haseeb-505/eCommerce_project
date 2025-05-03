# eCommerce_project

## This is an E-Commerce practice project.

### Environment Variables:
    PORT, MONOGODB_URI, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN,

### User Schema
 	  username, email, fullName, phone, address, refreshToken, role, password, avatarPhoto, coverPhoto

* if password is modified in user's credentials, then we need to hash the password again, for this we use `userSchame.pre()` method, which takes "save" as first argument and a callback function as second argument,
    In callback `async function(next)`, we first check if password is modified or not, if not, then return with passing execution to `next()`, if there has been a change in the password, then we need to hash it using bcrypt.

* `userSchema.methods.isPasswordSame`
* `userSchema.methods.generateAccessToken`
* `userSchema.methods.generateRefreshToken` 

### Utils:
    passwordHashingFunction, passwordComaprison, using bcrypt

### UserControllers (Basic User cControllers):
	registerUser, loginUser, logoutUser, updateAvatar, updateCover, updatePassword, 	passwordReset, 

	later on addition:

	userOrders, userProducts etc

### Middlerwares (pass the execution context to next):
	authMiddleware on the basis of `JWT` token generation, if user's current access token (`headers.authorization`) matches with the token stored in db, then we'll let the user accessing certain routes, it is primarily for logoutRoute, updateAvatar, Cover, passwrod middlewares

if accessToken does not match the token in db, we'll grant the user with a refreshToken

### UserRoutes:
	registerUserRoute, loginRoute, logoutRoute, passwordResetRoute

### userRoutes in app.js:
	create a basic path for userRoutes
  ``` js
	app.use("api/v1/user", userRoutes)
  ```

### FrontEnd:
    NavBar, other components like register, login, logout, etc

## Explanation of asyncHandler util

 * `asyncHandler` is a higher-order function used to wrap async route handlers in Express applications. 
 * Its purpose is to catch errors thrown inside  asynchronous functions and pass them to Express's built-in error handler.
 #### WHY IS IT NEEDED?
 ------------------
 * In Express, when you use async/await in route handlers and an error occurs 
 * (for example, a rejected promise or a thrown exception), Express does not automatically catch the error unless you manually use try/catch blocks.
 ### ❌ Without `asyncHandler`

```js
app.get('/user/:id', async (req, res) => {
  const user = await getUserById(req.params.id); // If this throws, Express won't catch it
  res.json(user);
});
```

This will crash or hang the server if an error occurs in `getUserById`, unless you wrap it in try/catch.

---

### ✅ With `asyncHandler`

```js
app.get('/user/:id', asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id); // If this throws, asyncHandler catches it
  res.json(user);
}));
```

This makes code cleaner, reusable, and avoids repetition of try/catch blocks in every route.

#### `HOW IT WORKS:`
--------------
- Takes an async function (requestHandler) as input
- Returns a new function that executes the requestHandler
- If the handler throws or rejects a Promise, the error is caught and passed to next(), so Express can handle it through its error-handling middleware
``` js
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
                next(err); // Passes error to Express error handler
            });
    };
};

module.exports = asyncHandler; 
```
