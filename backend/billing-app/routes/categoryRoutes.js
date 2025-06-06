const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.post('/insert', categoryController.insertCategory);
router.get('/checkDuplicate', categoryController.checkDuplicate);
router.put('/update', categoryController.updateCategory);
router.delete('/delete', categoryController.deleteCategory);
module.exports = router;
