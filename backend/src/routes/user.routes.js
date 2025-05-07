import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser, 
} from "../controller/user.controllers.js";
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

// check auth route, inject verifyJWT middleware
router.route("/check-auth").get(verifyJWT, (req, res) => {
    res.status(200).json({
        isAuthenticated: true,
        user: req.user,
    })
});
// logout route, inject veriufyJWT middleware before logoutUser controller
router.route("/logout").post(verifyJWT, logoutUser);


export default router;