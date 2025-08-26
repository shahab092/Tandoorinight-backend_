const express = require("express");
const {
  addInventory,
  getAllInventory,
  updateInventory,
  deleteInventory,
} = require("../controller/Inventory/inventoryController");

const router = express.Router();

router.post("/add", addInventory);
router.get("/all", getAllInventory);
router.put("/update/:id", updateInventory);
router.delete("/delete/:id", deleteInventory);

module.exports = router;
