const express = require("express");
const {
  addInventory,
  getAllInventory,
  updateInventory,
  deleteInventory,
  getInventoryByDateRange
} = require("../controller/Inventory/inventoryController");

const router = express.Router();

router.post("/add", addInventory);
router.get("/all", getAllInventory);
router.put("/update/:id", updateInventory);
router.delete("/delete/:id", deleteInventory);
router.get("/inventory/date-range", getInventoryByDateRange);
module.exports = router;
