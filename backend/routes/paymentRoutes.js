const express = require("express");
const router = express.Router();

// Import controllers
const {
  createOrder,
  verifyPayment,
  retryPayment,
  refundPayment,
  handleWebhook
} = require("../controllers/paymentController");

// Import authorization middlewares
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ─── ENDPOINTS ─────────────────────────────────────────────────────────────

// @route   POST /api/payment/create-order
// @desc    Initiate booking checkout by generating a pending Razorpay order
// @access  Private (Authenticated Users)
router.post("/create-order", protect, createOrder);

// @route   POST /api/payment/verify
// @desc    Verify incoming signature and update database records
// @access  Private (Authenticated Users)
router.post("/verify", protect, verifyPayment);

// @route   POST /api/payment/retry
// @desc    Initiate checkout retry for a failed or pending event booking
// @access  Private (Authenticated Users)
router.post("/retry", protect, retryPayment);

// @route   POST /api/payment/refund
// @desc    Issue standard full or partial payment refund for booking cancellations
// @access  Private (Admin Only)
router.post("/refund", protect, adminOnly, refundPayment);

// @route   POST /api/payment/webhook
// @desc    Razorpay background synchronization webhook listener
// @access  Public
router.post("/webhook", handleWebhook);

module.exports = router;