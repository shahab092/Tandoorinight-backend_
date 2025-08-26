const express = require("express");
const router = express.Router();
const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  filterExpenses
} = require("../controller/expenseController/expenseController");
const { validateExpense } = require("../validations/expenseValidation");

router.post("/add-expense", validateExpense, addExpense);
router.get("/get-expenses", getExpenses);
router.delete("/delete-expense/:id", deleteExpense);
router.put("/update-expense/:id", validateExpense, updateExpense); // ✅ Added
router.post("/filter", filterExpenses)

module.exports = router;
