const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.post('/insert', stockController.insertStock);
router.get('/stockDetails', stockController.getStockDetails);
router.put('/update', stockController.updateStockDetails);
router.delete('/delete', stockController.deleteStock);
router.get('/stockDetailsByBarcode', stockController.getStockDetailsByBarcode);
router.get('/stockDetailsByPartNumber', stockController.getStockDetailsByPartNumber);
router.get('/stockDetailsByBarcodeBilling', stockController.getStockDetailsByBarcodeForBilling);
router.get('/stockDetailsByPartNumberBilling', stockController.getStockDetailsByPartNumberForBilling);
module.exports = router;
