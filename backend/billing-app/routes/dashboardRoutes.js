const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/recent', dashboardController.getRecentSales);
router.get('/zerostock', dashboardController.getZeroStock);
module.exports = router;