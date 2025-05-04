# eCommerce_project

## This is an E-Commerce practice project.

### Environment Variables:
    PORT, MONOGODB_URI, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN,

### User Schema
 	  username, email, fullName, phone, address, refreshToken, role, password, avatarPhoto, coverPhoto

* if password is modified in user's credentials, then we need to hash the password again, for this we use `userSchame.pre()` or `userSchame.pre(methodName, options, callback)` method, which takes `methodName = (save, or remove, or update, etc.)` as first argument and a callback function as second argument,
    In callback `async function(next)`, we first check if password is modified or not, if not, then return with passing execution to `next()`, if there has been a change in the password, then we need to hash it using `bcrypt.hash()` and then pass execution to `next()`,

* `userSchema.methods.isPasswordSame`
* `userSchema.methods.generateAccessToken` using `jwt.sign(payload, secretToken from process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY })` -Payload in this case has everything but password and refreshToken
* `userSchema.methods.generateRefreshToken` using the same method as above but this time the payload carries not much information except `_id:this._id` where this refers to current user.

### Utils:
    passwordHashingFunction, passwordComaprison, using bcrypt
    - `uploadToCloudinary()` function for uploading the files to cloudinary.

### UserControllers (Basic User Controllers):
  #### registerUser
  - get user details from frontend
  - validation whether username or email is empty, 
  - or email is in correct format
  - check  if user already exists (unique email and username)
  - check for images
  - check for avatar
  - upload to cloudinary
  - check for avatar on cloudinary
  - create user object - create entry in db
  - remove password and refresh token field from response
  - check for user creation
  - return response
  
  #### loginUser
  - req body -> data(username, email, password, etc)
  - username or email,
  - check if username or email is registered in your db (find the user)
  - check password and check if password is correct (use user.isPasswordSame())
  - generate access token and refresh token
  - send token to secure cookies
  #### generateAccessRefreshToken function to generate refresh and access token, takes userId as parameter
  - finder the user with this id,
  - generate the access and refresh token spearately using current user's method, i.e., `user.generateAccessToken` and `user.generateRefreshToken`
  - save the newly generted refresh token against current user's refreshToekn using `user.refreshToken = refreshToken`
  - save the user but validate it before saving, use `user.save({ validateBeforeSaving: true })`
  - return { accessToken, refreshToken }
  - send token to secure cookies with httpOnly and secure options
  - send the response with user object and accessToken

  #### logoutUser
  - to get the user information, we can use User.findById(req.user._id)
  - but we do not have user_id from User with us,
  - we created user object by using `User.findOne(userid:_id)`
  - here we do not have direct access to db to get the user information
  - so we create a middle ware that will allow us to get this access to db when we provide it with the access token
  - so we will create a middleware that will run before this function
  - and for that middleware we check if it has the access token with it
  - if it has access token, we extract the _id from the decode payload(we sent when creating the accesstoken)
   that middleware is `auth.middleware.js` 
  - See 'auth.middleware.js` steps in middlware section
  ##### Basic Steps
    - `findByIdAndUpdate(id, update, options, callback)` using `req.user._id` 
    - update: An object containing the fields to be updated along with their new values. 
    - send the response with options `httpOnly` and `secure`
    - send the clearcookies with response
    - since we don't need to send `accessToken` and `refreshToken` so we make cookies as follows
      ```js
          return res.status(200)
            .learCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(
              new ApiResponse(200, null, "User logged out successfully")
            )
      ```
    
    
    
    `For Example` 
    ```js
    findByIdAndUpdate(req.user._id,
    update={
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    })
    ```
    - options: (Optional) An object specifying options such as new, upsert, runValidators, etc.

      - new: If set to true, returns the modified document rather than the original. Defaults to false.
      - upsert: If true, creates the document if it doesn’t exist. Defaults to false.
      - runValidators: If true, runs schema validation during the update. Defaults to false.
  #### updateAvatar, 
  #### updateCover, 
  #### updatePassword, 	
  #### passwordReset, 

	later on addition:

	userOrders, userProducts etc

### Middlerwares (pass the execution context to next):
  - `multer.middleware.js` to catre file uploading to local machine, like avatar, coverPhoto, etc.. Note: This middleware will be used wherever we need to upload some file, for example in userRoutes, as could be seen in following code snippest:
  ```js
  router.route("/register").post(upload.fields([
        // since we are uploading two objects here, cover image and avatar
        // that's why we need two object
        {name: "avatar", maxCount: 1},
        {name: "coverImage", maxCount: 1}
    ]), registerUser);
  ```
	#### `auth.middleware.js` on the basis of `JWT` token generation, 
    if user's current access token (`headers.authorization`) matches with the token stored in db, then we'll let the user accessing certain routes, it is primarily for logoutRoute, updateAvatar, Cover, passwrod middlewares.
  - get the access token from the request headers or cookies
  - validate the token, if not present, throw an error
  - decode the token against process.env.ACCESS_TOKEN_SECRET using jwt.verify()
  - The decodedToken will contain the payload that was originally signed when creating the JWT.
  - find the user using decodedToken._id and remove password and refreshToken from the user object
  - attach the user to the request object so that it can be user in the next middleware or route handler
  - pass execution to the next middlware or route handler

if `accessToken` does not match the token in db, we'll grant the user with a refreshToken

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
