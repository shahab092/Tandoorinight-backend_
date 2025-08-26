const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10,15}$/, "Phone number must be between 10-15 digits"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
