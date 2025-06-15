const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/recent', authenticateToken,dashboardController.getRecentSales);
router.get('/zerostock',authenticateToken, dashboardController.getZeroStock);
module.exports = router;