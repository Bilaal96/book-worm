import { Router } from "express";
import authController from "../controllers/authController.js";

const router = Router();

router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);

export default router;
