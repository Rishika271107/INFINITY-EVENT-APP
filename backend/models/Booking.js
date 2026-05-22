const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Reference to the booked venue
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: false
    },
    // Optional legacy fields retained for backward compatibility
    serviceName: { type: String },
    serviceType: { type: String },
    // New explicit booking details
    residentialArea: { type: String, required: false },
    eventDate: { type: Date, required: true },
    startTime: { type: String },
    durationHours: { type: Number, default: 1 },
    guestCount: { type: Number, required: false },
    totalAmount: { type: Number, required: true },
    // Status fields
    bookingStatus: { type: String, enum: ["pending", "confirmed", "cancelled", "failed"], default: "pending" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    // Razorpay integration fields
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);