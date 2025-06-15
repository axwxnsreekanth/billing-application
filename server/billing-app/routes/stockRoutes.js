const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authenticateToken = require('../middleware/authenticateToken');

// 🛡️ Protected routes – all require valid JWT
router.post('/insert', authenticateToken, stockController.insertStock);
router.get('/stockDetails', authenticateToken, stockController.getStockDetails);
router.put('/update', authenticateToken, stockController.updateStockDetails);
router.delete('/delete', authenticateToken, stockController.deleteStock);
router.get('/stockDetailsByBarcode', authenticateToken, stockController.getStockDetailsByBarcode);
router.get('/stockDetailsByPartNumber', authenticateToken, stockController.getStockDetailsByPartNumber);
router.get('/stockDetailsByBarcodeBilling', authenticateToken, stockController.getStockDetailsByBarcodeForBilling);
router.get('/stockDetailsByPartNumberBilling', authenticateToken, stockController.getStockDetailsByPartNumberForBilling);
router.get('/stockDetailsByMake', authenticateToken, stockController.getStockDetailsByMake);
router.get('/stockDetailsByModel', authenticateToken, stockController.getStockDetailsByModel);
router.get('/stockDetailsByItem', authenticateToken, stockController.getStockDetailsByItem);
router.get('/stockDetailsBycategory', authenticateToken, stockController.getStockDetailsByCategory);
router.get('/duplicateBarcode', authenticateToken, stockController.getDuplicateBarcode);
router.get('/duplicatePartNumber', authenticateToken, stockController.getDuplicatePartNumber);
router.get('/stockDetailsForExport', authenticateToken, stockController.getStockDetailsForExport);

module.exports = router;

