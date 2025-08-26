const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const itemController = require("../controller/itemsController/ItemsController");

// Create
router.post("/add", upload.single("image"), itemController.addProduct);

// Read
router.get("/all", itemController.getAllProducts);

// Update
router.put("/update/:id", upload.single("image"), itemController.updateProduct);

// Delete
router.delete("/delete/:id", itemController.deleteProduct);

module.exports = router;
