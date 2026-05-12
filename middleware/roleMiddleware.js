const ApiError = require("../utils/ApiError");

// Factory function — accepts one or more roles and returns middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Not authorized — please login first");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource`
      );
    }

    next();
  };
};

module.exports = { authorize };
