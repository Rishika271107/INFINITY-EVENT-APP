// backend/middleware/failedLoginLock.js – simple in‑memory lockout for repeated failed logins
// ----------------------------------------------------------
// Tracks failed login attempts per IP and blocks for a configurable period.
// This is a lightweight protection; for production you may replace with a DB‑backed solution.

const FAILED_ATTEMPTS = new Map(); // ip -> { count, blockedUntil }
const MAX_ATTEMPTS = 5;
const BLOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

module.exports = (req, res, next) => {
  const ip = req.ip;
  const record = FAILED_ATTEMPTS.get(ip) || { count: 0, blockedUntil: null };

  const now = Date.now();
  if (record.blockedUntil && now < record.blockedUntil) {
    return res.status(429).json({
      success: false,
      message: 'Too many failed login attempts. Try again later.',
    });
  }

  // Attach helper to increment on failure
  req.trackLoginFailure = () => {
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.blockedUntil = now + BLOCK_TIME_MS;
    }
    FAILED_ATTEMPTS.set(ip, record);
  };

  // Reset on success (optional, here we clear the record)
  req.resetLoginFailures = () => {
    FAILED_ATTEMPTS.delete(ip);
  };

  next();
};
