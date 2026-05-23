const jwt = require("jsonwebtoken");

/**
 * generateToken - creates a JWT containing user id and role.
 * @param {Object} user - Mongoose user document (or plain object) containing _id and role.
 * @returns {string} signed JWT token (expires in 1 day).
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = generateToken;