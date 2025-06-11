const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.post('/insert', billController.insertBillDetails);
router.get('/billReports', billController.getBillReport);
module.exports = router;
