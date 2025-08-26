const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10,15}$/, "Invalid phone number format"],
  },
  bankName: { type: String },  // Optional
  branch: { type: String },    // Optional
  iban: { type: String },      // Optional
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);
