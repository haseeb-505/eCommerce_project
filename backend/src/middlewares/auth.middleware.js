import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandlers.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, resizeBy, next) => {
    try {
        // get the access token from the request headers or cookies
        // validate the token, if not present, throw an error
        // decode the token against process.env.ACCESS_TOKEN_SECRET using jwt.verify()
        // The decodedToken will contain the payload that was originally signed when creating the JWT.
        // find the user using decodedToken._id and remove password and refreshToken from the user object
        // attac the user to the request object so that it can be user in the next middleware or route handler
        // pass execution to the next middlware or route handler

        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // decode the token against process.env.ACCESS_TOKEN_SECRET using jwt.verify()
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // fetch the user from the database using decodedToken._id and then remove password and refreshToken from the user object
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        // attach the user to the request object so that it can be user in the next middleware or route handler
        req.user = user;
        // pass execution to the next middleware or route handler
        next();
        
    } catch (error) {
        console.log("Invalid access token", error);
        throw new ApiError(401, error?.message || "Inavlid access token");
    }
});

