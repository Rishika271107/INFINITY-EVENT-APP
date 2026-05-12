// Standardized API response format for consistency across all endpoints
const sendResponse = (res, statusCode, data, message = "Success") => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
  });
};

module.exports = sendResponse;
