import express from "express";
import { login, refresh, logout, me } from "../controllers/authController.js";
import requireAuth from "../middleware/auth.js";

const route = express.Router();

// api/auth/login
route.post("/login", login);

// api/auth/refresh (reads the HttpOnly refresh cookie)
route.post("/refresh", refresh);

// api/auth/logout
route.post("/logout", logout);

// api/auth/me (check the current session on app load)
route.get("/me", requireAuth, me);

export default route;
