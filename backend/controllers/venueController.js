const Venue = require("../models/Venue");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Default initial venues data for seeding
const defaultVenues = [
  { name: "THE TAJ PALACE", city: "Mumbai", rating: 4.8, reviews: 428, price: 25000 },
  { name: "ITC GRAND CHOLA", city: "Chennai", rating: 4.7, reviews: 312, price: 22000 },
  { name: "THE LEELA PALACE", city: "Bangalore", rating: 4.9, reviews: 256, price: 30000 },
  { name: "OBEROI UDAIVILAS", city: "Udaipur", rating: 4.9, reviews: 521, price: 45000 },
  { name: "JW MARRIOTT", city: "Delhi", rating: 4.6, reviews: 387, price: 18000 },
  { name: "RAMBAGH PALACE", city: "Jaipur", rating: 4.8, reviews: 445, price: 35000 }
];

/**
 * @desc    Get all venues (and seed if empty)
 * @route   GET /api/venues
 * @access  Public or Private (depending on preference, let's allow public/private)
 */
exports.getAllVenues = asyncHandler(async (req, res, next) => {
  let venues = await Venue.find({});
  
  if (venues.length === 0) {
    console.log("Seeding venues database...");
    venues = await Venue.insertMany(defaultVenues);
  }

  res.status(200).json(
    new ApiResponse({
      message: "Venues retrieved successfully",
      data: venues
    })
  );
});

/**
 * @desc    Get single venue by ID
 * @route   GET /api/venues/:id
 * @access  Public or Private
 */
exports.getVenueById = asyncHandler(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id);
  if (!venue) {
    return next(new ApiError(404, "Venue not found"));
  }

  res.status(200).json(
    new ApiResponse({
      message: "Venue retrieved successfully",
      data: venue
    })
  );
});
