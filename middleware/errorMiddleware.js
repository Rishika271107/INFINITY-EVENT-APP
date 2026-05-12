const ApiError = require("../utils/ApiError");

// 404 handler for undefined routes
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found — ${req.originalUrl}`);
  next(error);
};

// Central error handler — all errors flow here
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    statusCode = 400;
    message = `Duplicate value for: ${field}. Please use another value.`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    statusCode = 400;
    message = messages.join(". ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token — please login again";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired — please login again";
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File too large. Maximum size is 5MB.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };