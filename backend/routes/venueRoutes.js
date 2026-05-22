const express = require("express");
const router = express.Router();
const { getAllVenues, getVenueById } = require("../controllers/venueController");

router.get("/", getAllVenues);
router.get("/:id", getVenueById);

module.exports = router;
