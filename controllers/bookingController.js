const Booking = require("../models/Booking");
const Vendor = require("../models/Vendor");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendResponse = require("../utils/sendResponse");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { vendor, eventType, eventDate, guestCount, totalPrice, specialRequest } = req.body;

  // Verify vendor exists and is approved
  const vendorDoc = await Vendor.findById(vendor);
  if (!vendorDoc) {
    throw new ApiError(404, "Vendor not found");
  }
  if (!vendorDoc.isApproved) {
    throw new ApiError(400, "This vendor is not yet approved for bookings");
  }
  if (!vendorDoc.availability) {
    throw new ApiError(400, "This vendor is currently unavailable");
  }

  const booking = await Booking.create({
    user: req.user._id,
    vendor,
    eventType,
    eventDate,
    guestCount,
    totalPrice,
    specialRequest: specialRequest || "",
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate("vendor", "businessName category pricing images")
    .populate("user", "name email");

  sendResponse(res, 201, populatedBooking, "Booking created successfully");
});

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const status = req.query.status;

  const query = { user: req.user._id };
  if (status) query.status = status;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate("vendor", "businessName category pricing.basePrice images location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(query),
  ]);

  sendResponse(res, 200, {
    bookings,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status;

  const query = {};
  if (status) query.status = status;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate("user", "name email phone")
      .populate("vendor", "businessName category pricing.basePrice")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(query),
  ]);

  sendResponse(res, 200, {
    bookings,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("vendor", "businessName category pricing images location contact");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Only owner or admin can view
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to view this booking");
  }

  sendResponse(res, 200, booking);
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private (owner for details, admin for status)
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isOwner = booking.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "Not authorized to update this booking");
  }

  // Users can only update certain fields on pending bookings
  if (isOwner && !isAdmin) {
    if (booking.status !== "pending") {
      throw new ApiError(400, "Can only modify pending bookings");
    }

    if (req.body.eventType) booking.eventType = req.body.eventType;
    if (req.body.eventDate) booking.eventDate = req.body.eventDate;
    if (req.body.guestCount) booking.guestCount = req.body.guestCount;
    if (req.body.specialRequest !== undefined) booking.specialRequest = req.body.specialRequest;
  }

  // Admin can update status and payment
  if (isAdmin) {
    if (req.body.status) booking.status = req.body.status;
    if (req.body.paymentStatus) booking.paymentStatus = req.body.paymentStatus;
    if (req.body.totalPrice) booking.totalPrice = req.body.totalPrice;
  }

  const updatedBooking = await booking.save();
  const populated = await Booking.findById(updatedBooking._id)
    .populate("user", "name email")
    .populate("vendor", "businessName category");

  sendResponse(res, 200, populated, "Booking updated successfully");
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private (owner or admin)
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isOwner = booking.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "Not authorized to cancel this booking");
  }

  // Users can only cancel pending/confirmed bookings
  if (isOwner && !isAdmin && !["pending", "confirmed"].includes(booking.status)) {
    throw new ApiError(400, "Cannot cancel a completed booking");
  }

  booking.status = "cancelled";
  await booking.save();

  sendResponse(res, 200, null, "Booking cancelled successfully");
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
};