const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor is required"],
    },
    eventType: {
      type: String,
      required: [true, "Event type is required"],
      enum: ["Wedding", "Reception", "Birthday", "Engagement", "Corporate", "Baby Shower"],
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    guestCount: {
      type: Number,
      required: [true, "Guest count is required"],
      min: [1, "Guest count must be at least 1"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Price cannot be negative"],
    },
    specialRequest: {
      type: String,
      maxlength: [1000, "Special request cannot exceed 1000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ vendor: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ eventDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);