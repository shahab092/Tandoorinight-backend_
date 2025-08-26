const express = require("express");
const { body } = require("express-validator");

const {
  addVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
} = require("../controller/vendorController/vendorController");

const router = express.Router();

// Validation middleware
const vendorValidation = [
  body("company").notEmpty().withMessage("Company name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("phone")
    .matches(/^\d{10,15}$/)
    .withMessage("Phone must be 10-15 digits"),
];

// Routes
router.get("/all", getAllVendors);
router.post("/add", vendorValidation, addVendor);
router.put("/update/:id", vendorValidation, updateVendor);
router.delete("/delete/:id", deleteVendor);

module.exports = router;
