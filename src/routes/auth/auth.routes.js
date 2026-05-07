import express from "express";

import { getMe, handleLogin, handleLogout, handleRefreshToken, handleSignup } from "./auth.method.js";
import verifyJWT from "../../middleware/verifyJWT.js";

const router = express.Router();

router.post("/login", handleLogin);
router.get("/logout", handleLogout);
router.post("/signup", handleSignup);
router.get("/refreshToken", handleRefreshToken);
router.get("/me", verifyJWT ,getMe);

export default router;