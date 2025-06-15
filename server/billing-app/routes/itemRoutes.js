const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/',authenticateToken, itemController.getAllItems);
router.post('/insert', authenticateToken,itemController.insertItem);
router.get('/checkDuplicate', authenticateToken,itemController.checkDuplicate);
router.put('/update',authenticateToken, itemController.updateItem);
router.delete('/delete', authenticateToken,itemController.deleteItem);
module.exports = router;
