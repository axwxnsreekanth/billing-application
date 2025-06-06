const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');

router.get('/', modelController.getAllModels);
router.get('/checkDuplicate', modelController.checkDuplicateModel);
router.post('/insert', modelController.insertModel);
router.put('/update', modelController.updateModel);
router.delete('/delete', modelController.deleteModel);
module.exports = router;
