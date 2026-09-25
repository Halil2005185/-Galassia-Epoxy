import express from "express";
import { login, refresh, logout, me } from "../controllers/authController.js";
import requireAuth from "../middleware/auth.js";
import { loginLimiter, refreshLimiter } from "../middleware/rateLimit.js";

const route = express.Router();

// api/auth/login
route.post("/login", loginLimiter, login);

// api/auth/refresh (reads the HttpOnly refresh cookie)
route.post("/refresh", refreshLimiter, refresh);

// api/auth/logout
route.post("/logout", logout);

// api/auth/me (check the current session on app load)
route.get("/me", requireAuth, me);

export default route;
