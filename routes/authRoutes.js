const express = require("express");
const router = express.Router();
const authController = require("../controller/auth/authController");
const authchecking = require("../controller/authchecking/authchecking");
const authMiddleware = require("../middleware/authmiddleware/authmiddleware");
// const authMiddleware = require("../middleware/authmiddleware/authmiddleware");

router.get("/me", authMiddleware, authchecking.me);
// signup
router.post("/signup", authController.signup);

// login
router.post("/login", authController.login);

// forgot password
router.post("/forgot-password", authController.forgotPassword);
router.post("/create-manager", authController.createManager);

// Get all users
router.get("/all-users", authController.getAllUsers);
module.exports = router;
