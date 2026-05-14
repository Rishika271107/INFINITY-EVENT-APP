const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");



// CREATE EVENT
router.post(
  "/create",
  protect,
  adminOnly,
  upload.single("image"),
  createEvent
);



// GET ALL EVENTS
router.get("/", getEvents);



// GET SINGLE EVENT
router.get("/:id", getSingleEvent);



// UPDATE EVENT
router.put(
  "/:id",
  protect,
  adminOnly,
  updateEvent
);



// DELETE EVENT
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEvent
);

module.exports = router;