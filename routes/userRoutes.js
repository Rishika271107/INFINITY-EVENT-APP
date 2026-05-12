const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  addFavorite,
  removeFavorite,
  deleteOwnAccount,
  getUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { uploadDisk } = require("../middleware/uploadMiddleware");

// Private user routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, uploadDisk.single("profileImage"), updateUserProfile)
  .delete(protect, deleteOwnAccount);

// Favorites
router.put("/favorites/:vendorId", protect, addFavorite);
router.delete("/favorites/:vendorId", protect, removeFavorite);

// Admin routes
router.get("/", protect, authorize("admin"), getUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id/block", protect, authorize("admin"), toggleBlockUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
