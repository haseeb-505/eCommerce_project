import { Router } from "express";
import { 
    refreshAccessToken,
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser, 
} from "../controller/auth.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
            name: "coverPhoto",
            maxCount: 1
        }
    ]),
    registerUser
);

// login route
router.route("/login").post(loginUser);
// refresh rout
router.route("/refresh").get(refreshAccessToken);

// check auth route, inject verifyJWT middleware
router.route("/check-auth").get(verifyJWT, getCurrentUser);
// logout route, inject veriufyJWT middleware before logoutUser controller
router.route("/logout").post(verifyJWT, logoutUser);


export default router;