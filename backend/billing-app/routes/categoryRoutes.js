const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken,categoryController.getAllCategories);
router.post('/insert',authenticateToken, categoryController.insertCategory);
router.get('/checkDuplicate',authenticateToken, categoryController.checkDuplicate);
router.put('/update', authenticateToken,categoryController.updateCategory);
router.delete('/delete',authenticateToken, categoryController.deleteCategory);
module.exports = router;
