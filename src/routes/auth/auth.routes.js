import express from "express";

import { handleLogin, handleLogout, handleRefreshToken, handleSignup } from "./auth.method.js";

const router = express.Router();

router.post("/login", handleLogin);
router.get("/logout", handleLogout);
router.post("/signup", handleSignup);
router.get("/refreshToken", handleRefreshToken);

export default router;