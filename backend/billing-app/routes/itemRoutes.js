const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getAllItems);
router.post('/insert', itemController.insertItem);
router.get('/checkDuplicate', itemController.checkDuplicate);
module.exports = router;
