const { body } = require("express-validator");
const { VENDOR_CATEGORIES } = require("../constants");

const createVendorValidation = [
  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name is required")
    .isLength({ max: 100 })
    .withMessage("Business name cannot exceed 100 characters"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(VENDOR_CATEGORIES)
    .withMessage(`Category must be one of: ${VENDOR_CATEGORIES.join(", ")}`),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("pricing.basePrice")
    .notEmpty()
    .withMessage("Base price is required")
    .isFloat({ min: 0 })
    .withMessage("Base price must be a positive number"),
  body("location.city").trim().notEmpty().withMessage("City is required"),
  body("contact.phone").trim().notEmpty().withMessage("Contact phone is required"),
];

const updateVendorValidation = [
  body("businessName")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Business name cannot exceed 100 characters"),
  body("category")
    .optional()
    .isIn(VENDOR_CATEGORIES)
    .withMessage(`Category must be one of: ${VENDOR_CATEGORIES.join(", ")}`),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("pricing.basePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Base price must be a positive number"),
];

module.exports = {
  createVendorValidation,
  updateVendorValidation,
};
