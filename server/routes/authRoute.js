import { Router } from "express";
import authController from "../controllers/authController.js";

import {
    handleSignupError,
    handleLoginError,
} from "../middleware/handleAuthError.js";

const router = Router();

// path: /auth/signup
router.post("/signup", authController.signup_post);
router.use("/signup", handleSignupError);

// path: /auth/login
router.post("/login", authController.login_post);
router.use("/login", handleLoginError);

// path: /auth/logout
router.get("/logout", authController.logout_get);

export default router;
