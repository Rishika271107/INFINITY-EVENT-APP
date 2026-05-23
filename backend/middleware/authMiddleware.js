const jwt = require("jsonwebtoken");

// authMiddleware.js – Production‑grade JWT authentication
// ------------------------------------------------------------
// This middleware validates Bearer JWT tokens, attaches the
// authenticated user to `req.user` (without the password), and
// provides an `adminProtect` wrapper for admin‑only routes.

const User = require("../models/User");

/**
 * protect – verifies JWT and loads the user.
 * Returns 401 for missing/invalid/expired tokens.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // Verify token – will throw JsonWebTokenError or TokenExpiredError
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded should contain { id, role, iat, exp }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // attach full user object (password excluded)
    next();
  } catch (error) {
    // Differentiate token errors for clearer messages
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    // Fallback for unexpected errors
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/**
 * adminProtect – ensures the authenticated user is an admin.
 * Must be used after `protect` (or it will invoke `protect` internally).
 */
const adminProtect = async (req, res, next) => {
  // Ensure user is authenticated first
  await protect(req, res, async () => {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  });
};

module.exports = {
  protect,
  adminProtect,
  adminOnly: adminProtect,
};