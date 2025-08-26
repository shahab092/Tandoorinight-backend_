const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController/customerController");

router.post("/add", customerController.addCustomer);
router.get("/all", customerController.getAllCustomers);
router.put("/update/:id", customerController.updateCustomer);
router.delete("/delete/:id", customerController.deleteCustomer);

module.exports = router;
