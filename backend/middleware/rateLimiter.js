// backend/middleware/rateLimiter.js – per‑route rate limiting
// ----------------------------------------------------------
// Uses express‑rate‑limit. Adjust limits to production requirements.
// NOTE: This file is imported only where needed (auth routes).

const rateLimit = require('express-rate-limit');

// General limiter (already applied globally in server.js) – keep for safety
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // high limit for non‑auth routes
});

// Auth specific limiters
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // 10 attempts per minute per IP
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again later.',
  },
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many OTP verification attempts. Please try again later.',
  },
});

module.exports = {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  otpLimiter,
};
