const express = require('express');
const router = express.Router();
const ledgerController = require('../controller/ledgerController/ledgerController');

 
router.get('/customers', ledgerController.getLedgerCustomers);
router.get('/ledger/:customerId', ledgerController.getCustomerLedger);
router.post('/pay/customer/:customerId', ledgerController.payCustomerBalance); // New route for general payments
router.get('/history/:customerId', ledgerController.getPaymentHistory);

module.exports = router;