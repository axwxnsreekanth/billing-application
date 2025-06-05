const express = require('express');
const router = express.Router();
const makeController = require('../controllers/makeController');

router.get('/', makeController.getAllMakes);
router.post('/insert', makeController.insertMake);
router.get('/checkDuplicate', makeController.checkDuplicateMake);
router.put('/update', makeController.updateMake);
router.delete('/delete', makeController.deleteMake);

module.exports = router;
