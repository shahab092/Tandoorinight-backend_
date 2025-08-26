const express  = require("express");
const  {
  addDeliveryPerson,
  getDeliveryPersons,
  getDeliveryPersonById,
  updateDeliveryPerson,
  deleteDeliveryPerson,
  updateDeliveryPersonStatus
} =require("../controller/deliveryPersonController/deliveryPersonController") ;

const router = express.Router();

// ✅ Routes
router.post("/", addDeliveryPerson);          // Add
router.get("/", getDeliveryPersons);          // Get all
router.get("/:id", getDeliveryPersonById);    // Get single
router.put("/:id", updateDeliveryPerson);     // Update
router.delete("/:id", deleteDeliveryPerson);  // Delete
router.patch("/:id/status", updateDeliveryPersonStatus)
module.exports =router;
