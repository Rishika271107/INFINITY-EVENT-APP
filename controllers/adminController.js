const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendResponse = require("../utils/sendResponse");

// @desc    Get dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalVendors,
    totalBookings,
    pendingVendors,
    recentBookings,
    revenueResult,
    bookingsByStatus,
    bookingsByEventType,
    monthlyBookings,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Vendor.countDocuments(),
    Booking.countDocuments(),
    Vendor.countDocuments({ isApproved: false }),
    Booking.find()
      .populate("user", "name email")
      .populate("vendor", "businessName category")
      .sort({ createdAt: -1 })
      .limit(5),
    Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]),
    Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]),
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  sendResponse(res, 200, {
    stats: {
      totalUsers,
      totalVendors,
      totalBookings,
      totalRevenue,
      pendingVendors,
    },
    bookingsByStatus,
    bookingsByEventType,
    monthlyBookings,
    recentBookings,
  });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const role = req.query.role;
  const search = req.query.search;

  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  sendResponse(res, 200, {
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Get all vendors (admin — includes unapproved)
// @route   GET /api/admin/vendors
// @access  Private/Admin
const getAdminVendors = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const approved = req.query.approved;

  const query = {};
  if (approved !== undefined) query.isApproved = approved === "true";

  const [vendors, total] = await Promise.all([
    Vendor.find(query)
      .populate("owner", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Vendor.countDocuments(query),
  ]);

  sendResponse(res, 200, {
    vendors,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Approve vendor
// @route   PUT /api/admin/vendors/:id/approve
// @access  Private/Admin
const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  vendor.isApproved = true;
  await vendor.save();

  sendResponse(res, 200, vendor, "Vendor approved successfully");
});

// @desc    Toggle featured vendor
// @route   PUT /api/admin/vendors/:id/feature
// @access  Private/Admin
const toggleFeaturedVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  vendor.isFeatured = !vendor.isFeatured;
  await vendor.save();

  sendResponse(
    res,
    200,
    { isFeatured: vendor.isFeatured },
    `Vendor ${vendor.isFeatured ? "featured" : "unfeatured"} successfully`
  );
});

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAdminBookings = asyncHandler(async (req, res) => {
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
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Booking.countDocuments(query),
  ]);

  sendResponse(res, 200, {
    bookings,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

module.exports = {
  getDashboardStats,
  getAdminUsers,
  getAdminVendors,
  approveVendor,
  toggleFeaturedVendor,
  getAdminBookings,
};
