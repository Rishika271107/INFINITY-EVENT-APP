/**
 * Centralized error handling middleware for Express.
 * Captures errors thrown in async handlers or synchronous routes and
 * returns a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if statusCode not set
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error for debugging (could be enhanced with a logger)
  console.error(`❌ [ERROR] ${statusCode} - ${message}`);
  if (err.stack) console.error(err.stack);

  const response = {
    success: false,
    message,
  };

  // Include stack trace only in non‑production environments for security
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };
