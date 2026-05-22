/**
 * Wrap an async function and forward any error to Express error handler.
 * @param {Function} fn Async route handler (req, res, next)
 * @returns {Function} Wrapped handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
