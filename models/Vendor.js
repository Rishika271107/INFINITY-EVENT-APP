const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      maxlength: [100, "Business name cannot exceed 100 characters"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Catering", "Photography", "Decoration", "DJ", "Makeup", "Event Planning"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    pricing: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Price cannot be negative"],
      },
      currency: {
        type: String,
        default: "INR",
      },
      packages: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          description: { type: String },
        },
      ],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }, // Cloudinary public_id for deletion
      },
    ],
    location: {
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    contact: {
      phone: { type: String, required: [true, "Contact phone is required"] },
      email: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    availability: {
      type: Boolean,
      default: true,
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
vendorSchema.index({ category: 1 });
vendorSchema.index({ "pricing.basePrice": 1 });
vendorSchema.index({ isApproved: 1 });
vendorSchema.index({ isFeatured: 1 });
vendorSchema.index({ owner: 1 });
vendorSchema.index({ "location.city": 1 });

module.exports = mongoose.model("Vendor", vendorSchema);