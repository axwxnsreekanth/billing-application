const express = require('express');
const router = express.Router();
const makeController = require('../controllers/makeController');

router.get('/', makeController.getAllMakes);
router.post('/insert', makeController.insertMake);
router.get('/checkDuplicate', makeController.checkDuplicateMake);

module.exports = router;
