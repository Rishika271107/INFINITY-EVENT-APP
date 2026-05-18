const Booking = require("../models/Booking");

// ─── CREATE BOOKING ───────────────────────────────────────────
exports.createBooking = async (req, res) => {
  try {
    const {
      serviceName,
      serviceType,
      area,
      eventDate,
      time,
      duration,
      guests,
      totalAmount
    } = req.body;

    const booking = await Booking.create({
      user: req.user._id,
      serviceName,
      serviceType,
      area,
      eventDate,
      time,
      duration,
      guests,
      totalAmount
    });

    console.log(`✅ NEW BOOKING CREATED: ${serviceType} for ${req.user.email}`);

    res.status(201).json({
      success: true,
      booking
    });

  } catch (error) {
    console.error("BOOKING CREATE ERROR:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

// ─── GET USER BOOKINGS ───────────────────────────────────────
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ─── GET ALL BOOKINGS (ADMIN) ────────────────────────────────
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "username email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ─── UPDATE BOOKING STATUS (ADMIN) ──────────────────────────
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.bookingStatus = req.body.bookingStatus || booking.bookingStatus;
    booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;

    await booking.save();

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ─── CANCEL BOOKING ──────────────────────────────────────────
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only user who booked it can cancel (or admin)
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};