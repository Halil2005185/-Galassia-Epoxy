import type { Request, Response, CookieOptions } from "express";
import asyncHandler from "express-async-handler";
import Admin, { loginValidationSchema } from "../model/Admin.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_MAX_AGE_MS,
} from "../lib/tokens.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

// Admin panel and backend are (or will be) on different origins — the
// refresh cookie needs SameSite=None + Secure in production (requires
// HTTPS on both ends), but SameSite=Lax works for local dev over plain
// HTTP where SameSite=None would be rejected by the browser.
function refreshCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    // Scoped to /api/auth since only the refresh/logout routes need it.
    path: "/api/auth",
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  };
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { error } = loginValidationSchema(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0]?.message });
    return;
  }

  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });

  // Same message whether the email doesn't exist or the password is
  // wrong — avoids leaking which one it was.
  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  const accessToken = signAccessToken({ adminId: admin.id });
  const refreshToken = signRefreshToken({ adminId: admin.id, tokenVersion: admin.tokenVersion });

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshCookieOptions());
  res.status(200).json({
    accessToken,
    admin: { id: admin.id, email: admin.email },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  if (!token) {
    res.status(401).json({ message: "Refresh token missing." });
    return;
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: "/api/auth" });
    res.status(401).json({ message: "Invalid or expired refresh token." });
    return;
  }

  const admin = await Admin.findById(payload.adminId);

  if (!admin || admin.tokenVersion !== payload.tokenVersion) {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: "/api/auth" });
    res.status(401).json({ message: "Refresh token has been invalidated." });
    return;
  }

  const accessToken = signAccessToken({ adminId: admin.id });
  // Rotate the refresh token on every use.
  const newRefreshToken = signRefreshToken({ adminId: admin.id, tokenVersion: admin.tokenVersion });

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, refreshCookieOptions());
  res.status(200).json({ accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await Admin.findByIdAndUpdate(payload.adminId, { $inc: { tokenVersion: 1 } });
    } catch {
      // Already invalid/expired — nothing to invalidate server-side.
    }
  }

  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: "/api/auth" });
  res.status(200).json({ message: "Logged out successfully." });
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const admin = await Admin.findById(req.adminId);

  if (!admin) {
    res.status(404).json({ message: "Admin not found." });
    return;
  }

  res.status(200).json({ id: admin.id, email: admin.email });
});
