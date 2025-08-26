const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController/categoryController");

// all routes start with /api/categories
router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.addCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
