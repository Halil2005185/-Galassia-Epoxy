import jwt from "jsonwebtoken";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be defined in the environment variables.`);
  }
  return value;
}

const ACCESS_SECRET = requireEnv("JWT_ACCESS_SECRET");
const REFRESH_SECRET = requireEnv("JWT_REFRESH_SECRET");

const ACCESS_MINUTES = Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES || 15);
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 30);

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
export const REFRESH_TOKEN_MAX_AGE_MS = REFRESH_DAYS * 24 * 60 * 60 * 1000;

export type AccessTokenPayload = { adminId: string };
export type RefreshTokenPayload = { adminId: string; tokenVersion: number };

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: `${ACCESS_MINUTES}m` });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: `${REFRESH_DAYS}d` });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
}
