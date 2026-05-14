const Booking = require("../models/Booking");
const Event = require("../models/Event");



// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {

    const {
      eventId,
      guests
    } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const totalAmount =
      event.price * guests;

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      guests,
      totalAmount
    });

    res.status(201).json({
      success: true,
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// GET USER BOOKINGS
exports.getUserBookings = async (
  req,
  res
) => {
  try {

    const bookings = await Booking.find({
      user: req.user._id
    })
      .populate("event")
      .populate("user", "name email");

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



// GET ALL BOOKINGS (ADMIN)
exports.getAllBookings = async (
  req,
  res
) => {
  try {

    const bookings = await Booking.find()
      .populate("event")
      .populate("user", "name email");

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



// UPDATE BOOKING STATUS
exports.updateBookingStatus = async (
  req,
  res
) => {
  try {

    const booking =
      await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.bookingStatus =
      req.body.bookingStatus ||
      booking.bookingStatus;

    booking.paymentStatus =
      req.body.paymentStatus ||
      booking.paymentStatus;

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



// CANCEL BOOKING
exports.cancelBooking = async (
  req,
  res
) => {
  try {

    const booking =
      await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
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