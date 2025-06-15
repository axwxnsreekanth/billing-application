const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/',authenticateToken, modelController.getAllModels);
router.get('/checkDuplicate',authenticateToken, modelController.checkDuplicateModel);
router.post('/insert',authenticateToken, modelController.insertModel);
router.put('/update', authenticateToken,modelController.updateModel);
router.delete('/delete',authenticateToken,modelController.deleteModel);
module.exports = router;
