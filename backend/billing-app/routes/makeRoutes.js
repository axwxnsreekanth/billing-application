const express = require('express');
const router = express.Router();
const makeController = require('../controllers/makeController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/',authenticateToken,makeController.getAllMakes);
router.post('/insert',authenticateToken, makeController.insertMake);
router.get('/checkDuplicate',authenticateToken, makeController.checkDuplicateMake);
router.put('/update',authenticateToken, makeController.updateMake);
router.delete('/delete',authenticateToken, makeController.deleteMake);

module.exports = router;
