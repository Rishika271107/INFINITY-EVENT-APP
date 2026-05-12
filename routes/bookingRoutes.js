const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { createBookingValidation, updateBookingValidation } = require("../validations/bookingValidation");

// User routes
router.post("/", protect, createBookingValidation, validate, createBooking);
router.get("/my-bookings", protect, getMyBookings);

// Admin route — get all bookings
router.get("/", protect, authorize("admin"), getBookings);

// Shared routes (owner or admin via controller logic)
router.get("/:id", protect, getBookingById);
router.put("/:id", protect, updateBookingValidation, validate, updateBooking);
router.delete("/:id", protect, cancelBooking);

module.exports = router;