const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    paymentMethod: {
      type: String,
      default: "unknown"
    },
    // Supporting both camelCase and requested snake_case for maximum resilience
    razorpay_order_id: {
      type: String,
      required: true
    },
    razorpay_payment_id: {
      type: String
    },
    razorpay_signature: {
      type: String
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    razorpaySignature: {
      type: String
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },
    receipt: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
