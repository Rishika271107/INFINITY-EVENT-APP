const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAdminUsers,
  getAdminVendors,
  approveVendor,
  toggleFeaturedVendor,
  getAdminBookings,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All admin routes require admin role
router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAdminUsers);
router.get("/vendors", getAdminVendors);
router.put("/vendors/:id/approve", approveVendor);
router.put("/vendors/:id/feature", toggleFeaturedVendor);
router.get("/bookings", getAdminBookings);

module.exports = router;
