const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc   Create a new Booking (pending) before payment
 * @route  POST /api/bookings/create
 * @access Private (JWT)
 */
exports.createBooking = asyncHandler(async (req, res, next) => {
  console.info('🚀 CREATE BOOKING payload →', req.body);

  const {
    venueId,
    eventDate,
    serviceName,
    serviceType,
    totalAmount: bodyTotalAmount,
    bookingDetails
  } = req.body;

  // ----- 1️⃣ Validation based on service type -----
  const isVenueBooking = !serviceType || serviceType.toLowerCase() === 'venue';

  if (!eventDate) {
    return next(new ApiError(400, 'Event date is required.'));
  }

  let totalAmount = 0;
  let finalVenueId = null;

  if (isVenueBooking) {
    if (!venueId || !bookingDetails) {
      return next(
        new ApiError(
          400,
          'All booking fields (venueId, eventDate, bookingDetails) are required for venue bookings.'
        )
      );
    }
    // Fetch venue from DB to compute price
    const venueObj = await Venue.findById(venueId);
    if (!venueObj) {
      return next(new ApiError(404, 'Venue not found.'));
    }
    const duration = bookingDetails?.durationHours ? Number(bookingDetails.durationHours) : 1;
    totalAmount = Number(venueObj.price) * duration;
    finalVenueId = venueId;
  } else {
    // Service booking
    if (!serviceName || !serviceType || bodyTotalAmount === undefined) {
      return next(
        new ApiError(
          400,
          'serviceName, serviceType, and totalAmount are required for service bookings.'
        )
      );
    }
    totalAmount = Number(bodyTotalAmount);
    finalVenueId = venueId || null; // optional venue ID
  }

  if (isNaN(totalAmount) || totalAmount < 0) {
    return next(new ApiError(400, 'Calculated or provided total amount is invalid.'));
  }

  // ----- 2️⃣ Persist booking -----
  const booking = await Booking.create({
    user: req.user._id,
    venue: finalVenueId,
    serviceName: serviceName || (isVenueBooking ? 'Venue Booking' : undefined),
    serviceType: serviceType || 'venue',
    eventDate,
    totalAmount,
    bookingDetails: bookingDetails || {},
    paymentStatus: 'pending', // Payments disabled
    bookingStatus: 'confirmed' // Directly confirmed without payment
  });

  console.info('✅ BOOKING SAVED →', {
    _id: booking._id,
    totalAmount: booking.totalAmount,
    user: booking.user,
    venue: booking.venue,
  });

  // ----- 3️⃣ Respond -----
  res.status(201).json(
    new ApiResponse({
      message: 'Booking created successfully.',
      data: { bookingId: booking._id, booking },
    })
  );
});

/**
 * @desc   Get bookings for the logged‑in user
 * @route  GET /api/bookings/my-bookings
 * @access Private
 */
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('venue')
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse({ success: true, bookings }));
});

/**
 * @desc   Admin – list all bookings
 * @route  GET /api/bookings/all
 * @access Private (admin)
 */
exports.getAllBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate('user', 'username email phone')
    .populate('venue')
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse({ success: true, bookings }));
});

/**
 * @desc   Admin – update booking status
 * @route  PUT /api/bookings/:id
 * @access Private (admin)
 */
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return next(new ApiError(404, 'Booking not found'));
  booking.bookingStatus = req.body.bookingStatus || booking.bookingStatus;
  booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;
  await booking.save();
  res.status(200).json(new ApiResponse({ success: true, booking }));
});

/**
 * @desc   Cancel a booking (owner or admin)
 * @route  PUT /api/bookings/cancel/:id
 * @access Private
 */
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return next(new ApiError(404, 'Booking not found'));
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ApiError(403, 'Not authorized to cancel this booking'));
  }
  booking.bookingStatus = 'cancelled';
  await booking.save();
  res.status(200).json(new ApiResponse({ success: true, message: 'Booking cancelled' }));
});