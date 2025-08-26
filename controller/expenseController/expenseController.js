const Expense = require("../../modules/expenseModel");
const { validationResult } = require("express-validator");

exports.addExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { description, amount } = req.body;
    const expense = new Expense({ description, amount });
    await expense.save();
    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Update an expense
exports.updateExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const { description, amount } = req.body;

    const updated = await Expense.findByIdAndUpdate(
      id,
      { description, amount },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense updated successfully", expense: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// @desc    Filter expenses by date range
exports.filterExpenses = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    // Validate
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "Both fromDate and toDate are required" });
    }

    // Convert to Date objects
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999); // Include full end day

    const filteredExpenses = await Expense.find({
      createdAt: {
        $gte: from,
        $lte: to,
      },
    }).sort({ createdAt: -1 });

    res.status(200).json({ expenses: filteredExpenses });
  } catch (error) {
    console.error("Filter Expenses Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
