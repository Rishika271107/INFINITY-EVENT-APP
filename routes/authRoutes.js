const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  refreshAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validations/authValidation");

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.post("/refresh-token", refreshAccessToken);
router.put("/change-password", protect, changePasswordValidation, validate, changePassword);
router.post("/forgot-password", forgotPasswordValidation, validate, forgotPassword);
router.post("/reset-password", resetPasswordValidation, validate, resetPassword);

module.exports = router;