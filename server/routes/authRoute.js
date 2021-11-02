import { Router } from "express";
import authController from "../controllers/authController.js";

import { handleSignupError } from "../middleware/handleAuthError.js";

const router = Router();

// path: /auth/signup
router.post("/signup", authController.signup_post);
router.use("/signup", handleSignupError);

// path: /auth/login
router.post("/login", authController.login_post);

export default router;
