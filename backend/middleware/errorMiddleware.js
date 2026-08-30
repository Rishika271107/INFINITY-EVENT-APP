// backend/middleware/errorMiddleware.js
// ─────────────────────────────────────────────────────────────────────────────
// Centralized error handling middleware.
//
// Concept: Middleware — runs after all routes, catches errors forwarded by
// next(err) from asyncHandler or any route handler.
//
// Concept: HTTP status codes used correctly:
//   400 Bad Request   — invalid input / validation failure
//   401 Unauthorized  — missing or invalid JWT
//   403 Forbidden     — authenticated but insufficient role
//   404 Not Found     — resource doesn't exist
//   500 Internal      — unhandled server error
//   502 Bad Gateway   — upstream service (e.g. Gemini API) failed
// ─────────────────────────────────────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  // Read the statusCode from the error object (set by ApiError),
  // fall back to any res.statusCode already set, else default to 500.
  const statusCode =
    err.statusCode ||
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  // Log the error server-side (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${statusCode}:`, err.message);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Never expose stack traces in production
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };

