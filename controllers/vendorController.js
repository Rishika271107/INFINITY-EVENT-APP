const Vendor = require("../models/Vendor");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendResponse = require("../utils/sendResponse");
const { cloudinary } = require("../config/cloudinary");

// @desc    Create vendor profile
// @route   POST /api/vendors
// @access  Private (vendor role or admin)
const createVendor = asyncHandler(async (req, res) => {
  const { businessName, category, description, pricing, location, contact } = req.body;

  // Check if user already has a vendor profile
  const existingVendor = await Vendor.findOne({ owner: req.user._id });
  if (existingVendor) {
    throw new ApiError(400, "You already have a vendor profile");
  }

  // Parse JSON strings if sent from form-data
  const parsedPricing = typeof pricing === "string" ? JSON.parse(pricing) : pricing;
  const parsedLocation = typeof location === "string" ? JSON.parse(location) : location;
  const parsedContact = typeof contact === "string" ? JSON.parse(contact) : contact;

  const vendorData = {
    businessName,
    owner: req.user._id,
    category,
    description,
    pricing: parsedPricing,
    location: parsedLocation,
    contact: parsedContact,
    isApproved: req.user.role === "admin", // Auto-approve if admin creates it
  };

  // Handle image uploads
  if (req.files && req.files.length > 0) {
    const imageUploads = [];
    for (const file of req.files) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        // Upload to Cloudinary from buffer
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "infinity-events/vendors" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageUploads.push({ url: result.secure_url, publicId: result.public_id });
      } else {
        // Fallback to local path
        imageUploads.push({ url: `/${file.path.replace(/\\/g, "/")}`, publicId: "" });
      }
    }
    vendorData.images = imageUploads;
  }

  const vendor = await Vendor.create(vendorData);

  sendResponse(res, 201, vendor, "Vendor profile created successfully");
});

// @desc    Get all vendors (public, with filtering, sorting, pagination)
// @route   GET /api/vendors
// @access  Public
const getVendors = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    city,
    sort,
    featured,
    page = 1,
    limit = 12,
    search,
  } = req.query;

  const query = { isApproved: true }; // Only show approved vendors publicly

  if (category) query.category = category;
  if (city) query["location.city"] = { $regex: city, $options: "i" };
  if (featured === "true") query.isFeatured = true;
  if (search) {
    query.$or = [
      { businessName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    query["pricing.basePrice"] = {};
    if (minPrice) query["pricing.basePrice"].$gte = Number(minPrice);
    if (maxPrice) query["pricing.basePrice"].$lte = Number(maxPrice);
  }

  let sortOptions = { createdAt: -1 };
  if (sort === "priceAsc") sortOptions = { "pricing.basePrice": 1 };
  if (sort === "priceDesc") sortOptions = { "pricing.basePrice": -1 };
  if (sort === "rating") sortOptions = { "ratings.average": -1 };
  if (sort === "newest") sortOptions = { createdAt: -1 };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [vendors, total] = await Promise.all([
    Vendor.find(query)
      .populate("owner", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit)),
    Vendor.countDocuments(query),
  ]);

  sendResponse(res, 200, {
    vendors,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Public
const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id).populate("owner", "name email profileImage");

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  sendResponse(res, 200, vendor);
});

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private (owner or admin)
const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  // Only owner or admin can update
  if (vendor.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to update this vendor");
  }

  const { businessName, category, description, pricing, location, contact, availability } = req.body;

  if (businessName) vendor.businessName = businessName;
  if (category) vendor.category = category;
  if (description) vendor.description = description;
  if (availability !== undefined) vendor.availability = availability;

  if (pricing) {
    const parsedPricing = typeof pricing === "string" ? JSON.parse(pricing) : pricing;
    vendor.pricing = { ...vendor.pricing.toObject(), ...parsedPricing };
  }
  if (location) {
    const parsedLocation = typeof location === "string" ? JSON.parse(location) : location;
    vendor.location = { ...vendor.location.toObject(), ...parsedLocation };
  }
  if (contact) {
    const parsedContact = typeof contact === "string" ? JSON.parse(contact) : contact;
    vendor.contact = { ...vendor.contact.toObject(), ...parsedContact };
  }

  // Handle new image uploads (append to existing)
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "infinity-events/vendors" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        vendor.images.push({ url: result.secure_url, publicId: result.public_id });
      } else {
        vendor.images.push({ url: `/${file.path.replace(/\\/g, "/")}`, publicId: "" });
      }
    }
  }

  const updatedVendor = await vendor.save();

  sendResponse(res, 200, updatedVendor, "Vendor updated successfully");
});

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private (owner or admin)
const deleteVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  if (vendor.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to delete this vendor");
  }

  // Delete images from Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME && vendor.images.length > 0) {
    for (const img of vendor.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId).catch(() => {});
      }
    }
  }

  await Vendor.deleteOne({ _id: vendor._id });

  sendResponse(res, 200, null, "Vendor deleted successfully");
});

// @desc    Get vendors owned by current user
// @route   GET /api/vendors/my-vendors
// @access  Private (vendor role)
const getMyVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({ owner: req.user._id });
  sendResponse(res, 200, vendors);
});

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getMyVendors,
};