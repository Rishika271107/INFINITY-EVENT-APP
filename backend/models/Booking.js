const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
    },
    serviceName: { type: String },
    serviceType: { type: String },
    eventDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    bookingDetails: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Booking lifecycle status – default pending (manual admin confirmation later)
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    // Payment status kept for future extensions but defaults to pending (no auto‑payment)
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
bookingSchema.index({ user: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);