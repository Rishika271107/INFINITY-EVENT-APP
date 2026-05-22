const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    budgetLimit: {
      type: Number,
      default: 1000000
    },
    spentAmount: {
      type: Number,
      default: 0
    },
    remainingAmount: {
      type: Number,
      default: 1000000
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
