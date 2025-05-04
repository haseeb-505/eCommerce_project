import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser, 
} from "../controller/user.controllers";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";

// initialize the router
const router = Router();

// routes here
// in registerUser controller, we inject upload middleware before registerUser controller
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

// login route
router.route("/login").post(loginUser);

// logout route, inject veriufyJWT middleware before logoutUser controller
router.route("/logout").post(verifyJWT, logoutUser);


export default router;