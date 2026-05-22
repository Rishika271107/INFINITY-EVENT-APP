const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 5
    },
    reviews: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema);
