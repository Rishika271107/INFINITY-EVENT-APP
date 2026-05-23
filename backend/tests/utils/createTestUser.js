const bcrypt = require('bcryptjs');
const User = require('../../models/User');

/**
 * Create a test user in the in‑memory DB.
 * @param {Object} options
 * @param {string} [options.email] - User email.
 * @param {string} [options.password] - Plain‑text password (default: 'Password123!').
 * @param {string} [options.role] - 'user' or 'admin' (default: 'user').
 * @returns {Promise<Object>} The saved Mongoose user document.
 */
async function createTestUser({ 
  email = `test_${Date.now()}@example.com`, 
  password = 'Password123!', 
  role = 'user',
  username = 'TestUser',
  phone = '1234567890',
  isVerified = true
} = {}) {
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, phone, password: hashed, role, isVerified });
  await user.save();
  return user;
}

module.exports = { createTestUser };
