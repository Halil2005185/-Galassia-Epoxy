import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/tokens.js";

export interface AuthenticatedRequest extends Request {
  adminId?: string;
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.adminId = payload.adminId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired access token." });
  }
}

export default requireAuth;
