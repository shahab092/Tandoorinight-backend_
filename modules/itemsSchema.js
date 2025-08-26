const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  unit: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  images: { type: String },
  barcodeValue: { type: String, unique: true },
  barcodeImagePath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Item", itemSchema);
