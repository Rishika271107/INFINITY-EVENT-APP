const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendResponse = require("../utils/sendResponse");

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites", "businessName category pricing.basePrice images");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  sendResponse(res, 200, user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;

  if (req.file) {
    user.profileImage = req.file.path ? `/${req.file.path.replace(/\\/g, "/")}` : user.profileImage;
  }

  const updatedUser = await user.save();

  sendResponse(res, 200, {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
    profileImage: updatedUser.profileImage,
  }, "Profile updated successfully");
});

// @desc    Add vendor to favorites
// @route   PUT /api/users/favorites/:vendorId
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const vendorId = req.params.vendorId;

  if (user.favorites.includes(vendorId)) {
    throw new ApiError(400, "Vendor already in favorites");
  }

  user.favorites.push(vendorId);
  await user.save();

  sendResponse(res, 200, user.favorites, "Vendor added to favorites");
});

// @desc    Remove vendor from favorites
// @route   DELETE /api/users/favorites/:vendorId
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.favorites = user.favorites.filter(
    (fav) => fav.toString() !== req.params.vendorId
  );
  await user.save();

  sendResponse(res, 200, user.favorites, "Vendor removed from favorites");
});

// @desc    Delete own account
// @route   DELETE /api/users/profile
// @access  Private
const deleteOwnAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await User.deleteOne({ _id: user._id });

  // Clear cookies
  res.cookie("accessToken", "", { maxAge: 0 });
  res.cookie("refreshToken", "", { maxAge: 0 });

  sendResponse(res, 200, null, "Account deleted successfully");
});

// ─── ADMIN ROUTES ───

// @desc    Get all users (with pagination & search)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  sendResponse(res, 200, {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  sendResponse(res, 200, user);
});

// @desc    Block/Unblock user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(400, "Cannot block an admin account");
  }

  user.isBlocked = !user.isBlocked;
  await user.save({ validateBeforeSave: false });

  sendResponse(
    res,
    200,
    { isBlocked: user.isBlocked },
    `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`
  );
});

// @desc    Delete user by admin
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(400, "Cannot delete an admin account");
  }

  await User.deleteOne({ _id: user._id });

  sendResponse(res, 200, null, "User deleted successfully");
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  addFavorite,
  removeFavorite,
  deleteOwnAccount,
  getUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
};
