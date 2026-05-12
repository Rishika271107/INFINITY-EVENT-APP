const { body } = require("express-validator");
const { EVENT_TYPES } = require("../constants");

const createBookingValidation = [
  body("vendor").notEmpty().withMessage("Vendor ID is required").isMongoId().withMessage("Invalid vendor ID"),
  body("eventType")
    .notEmpty()
    .withMessage("Event type is required")
    .isIn(EVENT_TYPES)
    .withMessage(`Event type must be one of: ${EVENT_TYPES.join(", ")}`),
  body("eventDate")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Event date must be a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Event date must be in the future");
      }
      return true;
    }),
  body("guestCount")
    .notEmpty()
    .withMessage("Guest count is required")
    .isInt({ min: 1 })
    .withMessage("Guest count must be at least 1"),
  body("totalPrice")
    .notEmpty()
    .withMessage("Total price is required")
    .isFloat({ min: 0 })
    .withMessage("Total price must be a positive number"),
  body("specialRequest")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Special request cannot exceed 1000 characters"),
];

const updateBookingValidation = [
  body("eventType")
    .optional()
    .isIn(EVENT_TYPES)
    .withMessage(`Event type must be one of: ${EVENT_TYPES.join(", ")}`),
  body("eventDate")
    .optional()
    .isISO8601()
    .withMessage("Event date must be a valid date"),
  body("guestCount")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Guest count must be at least 1"),
  body("status")
    .optional()
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage("Invalid booking status"),
  body("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed", "refunded"])
    .withMessage("Invalid payment status"),
];

module.exports = {
  createBookingValidation,
  updateBookingValidation,
};
