const express = require("express");
const router = express.Router();
const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getMyVendors,
} = require("../controllers/vendorController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { uploadMemory, uploadDisk } = require("../middleware/uploadMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { createVendorValidation, updateVendorValidation } = require("../validations/vendorValidation");

// Determine upload strategy based on Cloudinary config
const getUpload = () => {
  return process.env.CLOUDINARY_CLOUD_NAME ? uploadMemory : uploadDisk;
};

// Public routes
router.get("/", getVendors);
router.get("/my-vendors", protect, authorize("vendor", "admin"), getMyVendors);
router.get("/:id", getVendorById);

// Vendor/Admin routes
router.post(
  "/",
  protect,
  authorize("vendor", "admin"),
  getUpload().array("images", 10),
  createVendorValidation,
  validate,
  createVendor
);

router.put(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  getUpload().array("images", 10),
  updateVendorValidation,
  validate,
  updateVendor
);

router.delete("/:id", protect, authorize("vendor", "admin"), deleteVendor);

module.exports = router;