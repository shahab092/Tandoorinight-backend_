const Product = require("../../modules/itemsSchema");
const mongoose = require("mongoose");
const bwipjs = require("bwip-js");
const getNextBarcode = require("../../utils/getNextBarcode");
const uploadToCloudinary = require("../../utils/cloudinary"); // Your helper

// ✅ Add Product
const addProduct = async (req, res) => {
  try {
    const { title, unitPrice, unit, category } = req.body;

    if (!title || !unit || !category || unitPrice == null) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // ✅ Upload product image to Cloudinary
    let imageUrl = null;
    if (req.file?.buffer) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "products");
    }

    // ✅ Generate barcode
    const barcodeValue = await getNextBarcode();

    const pngBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: barcodeValue,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });

    // ✅ Upload barcode to Cloudinary
    const barcodeImageUrl = await uploadToCloudinary(pngBuffer, "barcodes");

    // ✅ Save Product to DB
    const newProduct = new Product({
      title,
      unitPrice,
      unit,
      category,
      images: imageUrl,
      barcodeValue,
      barcodeImagePath: barcodeImageUrl,
    });

    const saved = await newProduct.save();
    res.status(201).json({ success: true, message: "Product added", product: saved });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal error", error: error.message });
  }
};

// ✅ Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, unitPrice, unit, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // ✅ Upload new image if provided
    if (req.file?.buffer) {
      const newImageUrl = await uploadToCloudinary(req.file.buffer, "products");
      product.images = newImageUrl;
    }

    // ✅ Update fields
    if (title) product.title = title;
    if (unitPrice != null) product.unitPrice = unitPrice;
    if (unit) product.unit = unit;
    if (category) product.category = category;

    const updated = await product.save();
    res.status(200).json({ success: true, message: "Product updated", product: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Internal error", error: error.message });
  }
};

// ✅ Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Internal error", error: error.message });
  }
};

// ✅ Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")  // populate category with only `name` field
      .lean();

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};


module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
