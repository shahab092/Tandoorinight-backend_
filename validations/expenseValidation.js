const { body } = require("express-validator");

exports.validateExpense = [
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 2 })
    .withMessage("Description must be at least 2 characters"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0"),
];
