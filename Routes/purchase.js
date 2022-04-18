const express = require('express');

const purchaseController = require('../Controller/purchase');
const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticatemiddleware.authenticate, purchaseController.purchasePreminum);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;