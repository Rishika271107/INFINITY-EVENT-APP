const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    serviceName: {
      type: String,
      required: true
    },

    serviceType: {
      type: String,
      enum: ["venue", "food", "photography", "decoration", "fashion", "makeup", "tourist"],
      required: true
    },

    area: {
      type: String,
    },

    eventDate: {
      type: Date,
      required: true
    },

    time: {
      type: String,
    },

    duration: {
      type: Number,
      default: 1
    },

    guests: {
      type: Number,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Booking",
  bookingSchema
);