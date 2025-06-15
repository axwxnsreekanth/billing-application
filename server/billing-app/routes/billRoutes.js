const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const authenticateToken = require('../middleware/authenticateToken');

// 🛡️ Protected routes (JWT required)
router.post('/insert', authenticateToken, billController.insertBillDetails);
router.get('/billReports', authenticateToken, billController.getBillReport);
router.get('/labourReports', authenticateToken, billController.getLabourReport);
router.get('/billDetailsByInvoiceNo', authenticateToken, billController.getBillDetails);
router.put('/saveBillReturn', authenticateToken, billController.saveBillReturn);
router.get('/billReturnReports', authenticateToken, billController.getBillReturnReport);

module.exports = router;
