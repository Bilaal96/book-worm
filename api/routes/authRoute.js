import { Router } from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Custom Error Handling Middleware
import {
    handleSignupError,
    handleLoginError,
} from "../middleware/handleAuthError.js";

const router = Router();

// path: /api/auth/signup
router.post("/signup", authController.signup_post);
router.use("/signup", handleSignupError);

// path: /api/auth/login
router.post("/login", authController.login_post);
router.use("/login", handleLoginError);

// path: /api/auth/refresh
router.get(
    "/refresh",
    authMiddleware.verifyRefreshToken,
    authController.refresh_get
);

// path: /api/auth/logout
router.get(
    "/logout",
    authMiddleware.verifyAccessToken,
    authController.logout_get
);

export default router;
