import rateLimit from "express-rate-limit";

// There is exactly one admin account and no lockout/CAPTCHA, so throttling
// login attempts is the only thing standing between this account and an
// offline-friendly brute-force guesser.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

// The Admin panel silently calls /refresh whenever an access token expires,
// so this needs to be generous enough for normal use while still bounding
// abuse of an unauthenticated endpoint.
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

// Baseline abuse protection across the whole API, generous enough to never
// affect normal browsing/admin use.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});
