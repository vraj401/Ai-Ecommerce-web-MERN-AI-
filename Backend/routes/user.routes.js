import express from "express";
const router = express.Router();
import { validationResult } from "express-validator";
import {body} from "express-validator";
import userController from "../controllers/user.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { trackActivity } from "../controllers/userActivity.controller.js";


router.post("/register", [
    body('email').isEmail().withMessage("Please enter a valid email address"),  
    body('fullname.firstname').isLength({min:3}).withMessage("First name must be at least 3 characters long"),
    body.apply('password').isLength({min:6}).withMessage("Password must be at least 6 characters long")
],
userController.Register)


router.post("/login",
    [
        body('email').isEmail().withMessage("Please enter a valid email address"),
        body('password').isLength({min:6}).withMessage("Password must be at least 6 characters long")
    ],
    userController.loginUser
)

router.post("/logout", authUser,userController.logoutUser)
router.post("/track", trackActivity);
export default router;

