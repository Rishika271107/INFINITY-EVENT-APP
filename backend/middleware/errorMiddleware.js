// backend/middleware/errorMiddleware.js – Centralized error handling
// ----------------------------------------------------------
// This middleware catches errors from async handlers and sends a consistent JSON response.
// It hides stack traces in production for security.

const errorHandler = (err, req, res, next) => {
  // Default to 500 if statusCode not set
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    success: false,
    message: err.message || 'Server Error',
    // In production hide stack trace
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
