const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');

router.get('/', modelController.getAllModels);
router.get('/checkDuplicate', modelController.checkDuplicateModel);
router.post('/insert', modelController.insertModel);
// router.post('/insert', makeController.insertMake);

module.exports = router;
