import { Router } from "express";
import { registerUser, loginUser, getCurrentUser } from "./auth.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authMiddleware, getCurrentUser);

export default router;
