const express = require("express");

const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
} = require("../controllers/bookingController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");



// CREATE BOOKING
router.post(
  "/create",
  protect,
  createBooking
);



// GET USER BOOKINGS
router.get(
  "/my-bookings",
  protect,
  getUserBookings
);



// GET ALL BOOKINGS (ADMIN)
router.get(
  "/all",
  protect,
  adminOnly,
  getAllBookings
);



// UPDATE BOOKING STATUS
router.put(
  "/:id",
  protect,
  adminOnly,
  updateBookingStatus
);



// CANCEL BOOKING
router.put(
  "/cancel/:id",
  protect,
  cancelBooking
);

module.exports = router;