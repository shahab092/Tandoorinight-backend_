const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController/orderController');
const authMiddleware = require('../middleware/authmiddleware/authmiddleware');
// Place a new order
router.post('/checkout', authMiddleware ,orderController.placeOrder);
// Update cart item quantity and adjust inventory
router.post('/update-quantity', orderController.updateCartItemQuantity);
router.get('/orders', orderController.getAllOrders);
router.patch('/orders/:orderId/status', orderController.updateOrderStatus);
router.get('/monthly-orders', orderController.getMonthlyOrders);
router.post('/search-orders', orderController.searchOrdersByDate);
router.get('/unique-users', orderController.getUniqueOrderUsers);
module.exports = router;
