// backend/routes/authRoutes.js – Authentication routes with validation, rate limiting, and lockout
// ----------------------------------------------------------
const express = require('express');
const router = express.Router();

// Controllers
const {
  registerUser,
  verifyOTP,
  loginUser,
  resendOTP,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');

// Async handler wrapper (controllers already use asyncHandler internally)
const asyncHandler = require('../utils/asyncHandler');

// Validation middleware and schemas
const validate = require('../middleware/validate');
const {
  registerSchema,
  verifyOTPSchema,
  loginSchema,
  adminLoginSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validationSchemas/authValidation');

// Auth protection middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Rate limiting middleware
const { loginLimiter, registerLimiter, otpLimiter } = require('../middleware/rateLimiter');

// Failed login lockout middleware


// Routes – validation, rate limiting, and protection applied
router.post('/register', registerLimiter, validate(registerSchema), asyncHandler(registerUser));
router.post('/verify-otp', otpLimiter, validate(verifyOTPSchema), asyncHandler(verifyOTP));
router.post('/login', loginLimiter, validate(loginSchema), asyncHandler(loginUser));

router.post('/resend-otp', validate(resendOTPSchema), asyncHandler(resendOTP));
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(resetPassword));
router.get('/me', protect, asyncHandler(getUserProfile));
router.put('/profile', protect, asyncHandler(updateUserProfile));

module.exports = router;