const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.post('/insert', stockController.insertStock);
router.get('/stockDetails', stockController.getStockDetails);
router.put('/update', stockController.updateStockDetails);
module.exports = router;
