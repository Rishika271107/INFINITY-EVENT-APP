// backend/validationSchemas/authValidation.js – Zod schemas for authentication routes
// ----------------------------------------------------------
// These schemas are used with the validate middleware to ensure request bodies
// contain the required fields and have correct types.

const { z } = require('zod');

// Register user schema
const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).strict();


// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
}).strict();

// Admin login schema (same as user login but could be extended)
const adminLoginSchema = loginSchema;


module.exports = {
  registerSchema,
  loginSchema,
  adminLoginSchema,
};
