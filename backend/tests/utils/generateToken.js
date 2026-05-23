// utils/generateToken.js
const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for test purposes.
 * @param {Object} payload - Custom payload fields (e.g., {id, role}).
 * @param {string|number} expiresIn - Expiration (default 1h).
 * @returns {string} Signed JWT.
 */
function generateToken(payload = {}, expiresIn = '1h') {
  const secret = process.env.JWT_SECRET || 'testsecret';
  const defaultPayload = { id: payload.id || 'testuserid', role: payload.role || 'user' };
  return jwt.sign(defaultPayload, secret, { expiresIn });
}

module.exports = { generateToken };
