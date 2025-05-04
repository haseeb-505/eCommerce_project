import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";


const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // save newly generated refresh token inplace of user.refreshToken
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Error generating access and refresh token", error);
        throw new ApiError(500, "Error generating access and refresh token");
    }
};

// controller functions

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend req.body
    // validation whether username or email is empty, 
    // or email is in correct format
    // check  if user already exists (unique email and username)
    // check for images
    // check for avatar
    // upload to cloudinary
    // check for avatar on cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response
    
    const {username, email, password, fullName, phone, address, role} = req.body;
    if ([username, email, password, fullName].some((field) => field.trim==="")) {
        return new ApiResponse(res, 400, false, "All field are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return new ApiResponse(res, 400, false, "Email is not valid");
    }

    const userExists = await User.findOne({$or: [{username}, {email}]});
    if (userExists) {
        return new ApiResponse(res, 400, false, "User with same email or username already exists")
    }

    const avatarLocalFile = req.files?.avatar[0]?.path;
    let coverPhotoLocalFile = req.files?.coverPhoto[0]?.path;

    // since only avatar is mendatory, so we check for avatar file only
    if (!avatarLocalFile) {
        return new ApiResponse(res, 400, false, "Avater is required")
    }

    // upload the files to cloudinary
    const avatar = await uploadToCloudinary(avatarLocalFile);
    const coverPhoto = await uploadToCloudinary(coverPhotoLocalFile);

    // if upload fails,
    if (!avatar) {
        return new ApiResponse(res, 500, false, "Error uploading files to cloudinary")
    }

    // create the user object
    const user = await User.create({
        username: username.toLowerCase(),
        email: email.trim(),
        fullName: fullName.trim(), 
        avatar: avatar.url,
        coverPhoto: coverPhoto?.url || "",
        password,
        phone: phone.trim() || "",
        address: address.trim() || "",
        role: role.trim() || "user",
    })

    // check if user is created successfully
    if (!user) {
        return new ApiResponse(res, 500, false, "Error creating user")
    }

    // user is created successfully and now we have to send this user in response, so we need to remove  the password and refreshToken
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    // return the response
    return res.status(201).json(
        new ApiResponse(res, 201, true, "User created successfully!!!")
    )
});

// login user
const loginUser = asyncHandler(async (req, res) => {
    // req body -> data(username, email, password, etc)
    // username or email,
    // check if username or email is registered in your db (find the user)
    // check password and check if password is correct (use user.isPasswordSame())
    // generate access token and refresh token
    // we do not want to send the password and refresh token to the user
    // send token to secure cookies with httpOnly and secure options
    //  send the response with user object and accessToken

    const { username, email, password } = req.body;
    if (!username && !email) {
        return new ApiResponse( res, 400, false, "username or email is required");
    };

    if (!password) {
        return new ApiResponse( res, 400, false, "password is required")
    }

    // find the user in db
    // make sure to recieve only one these, username or email
    const user = await User.findOne({ $or: [{ username }, { email}]});
    if (!user) {
        return new ApiResponse( res, 400, false, "No user found with this username or email");
    }

    // check if password is correct
    const isPasswordSame = await user.isPasswordSame(password);
    if (!isPasswordSame) {
        return new ApiResponse( res, 400, false, "password is invalid")
    }

    // generate accessToken and refreshToken
    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);
    if (!accessToken || !refreshToken) {
        return new ApiResponse(res, 500, false, "Error generating access and refresh toekns");
    }

    // remove password and refreshToken from user object of send user in response
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // send the cookies in response
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken}, "user loggdIn successfully")
        )

});

// lgout user
const logoutUser = asyncHandler(async (req, res) => {
    // to get the user information, we can use User.findById(req.user._id)
    // but we do not have user_id from User with us,
    // we created user object by using User.findOne(userid:_id)
    // here we do not have direct access to db to get the user information
    // so we create a middle ware that will allow us to get this access to db
    // when we provide it with the access token
    // so we will create a middleware that will run before this function
    // and for that middleware we check if it has the access token with it
    // if it has access token, we extract the _id from the decode payload(we sent when creating the accesstoken)

    await User.findByIdAndUpdate(req.user._id, {
        // update the refresh token to null
        $set: { refreshToken: undefined },

    },
    {
        new: true,
    });

    // need to send the cookies in response
    options = {
        httpOnly: true,
        secure: true,
    }

    // return the response with cookies
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, null, "User logged out successfully")
        )
});






export  { 
    registerUser,
    loginUser,
    logoutUser,
}







