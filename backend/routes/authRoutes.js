const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyOTP,
  loginUser,
  adminLogin,
  resendOTP,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;