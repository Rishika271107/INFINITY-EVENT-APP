class ApiError extends Error {
  /**
   * @param {number} statusCode HTTP status code
   * @param {string} message Error message
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    // Capture stack trace (excluding constructor)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
