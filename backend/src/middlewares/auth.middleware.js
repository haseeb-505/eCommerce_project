import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandlers.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        // 1. Get token from cookies or Authorization header
        const token = req.cookies?.accessToken || 
                     req.header("Authorization")?.replace("Bearer ", "");

        // 2. If no token, return unauthenticated
        if (!token) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "Not authorized"
            });
        }

        // 3. Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // 4. Find user
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "User not found"
            });
        }

        // 5. Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            isAuthenticated: false,
            message: error.message || "Invalid token"
        });
    }
});

