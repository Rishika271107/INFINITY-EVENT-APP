const express = require("express");
const router = express.Router();

// Import Admin controllers
const {
  getDashboardStats,
  getTransactions,
  getUsers,
  getVendors
} = require("../controllers/adminController");

// Import authentication check middlewares
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ─── ADMIN PANEL ROUTING ──────────────────────────────────────────────────

// @route   GET /api/admin/stats
// @desc    Retrieve aggregated business counters (Users, Bookings, Revenues)
// @access  Private (Admin Only)
router.get("/stats", protect, adminOnly, getDashboardStats);

// @route   GET /api/admin/transactions
// @desc    Query the transaction log database populated with users & bookings
// @access  Private (Admin Only)
router.get("/transactions", protect, adminOnly, getTransactions);

// @route   GET /api/admin/users
// @desc    Query all registered customers dynamically populated with booking statistics
// @access  Private (Admin Only)
router.get("/users", protect, adminOnly, getUsers);

// @route   GET /api/admin/vendors
// @desc    Query the active partner vendor index
// @access  Private (Admin Only)
router.get("/vendors", protect, adminOnly, getVendors);

module.exports = router;
