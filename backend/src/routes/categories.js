const router = require('express').Router();
const { body } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { listCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Public
router.get('/', listCategories);

// Admin only
router.post('/', authenticate, authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
], validate, createCategory);

router.put('/:id',    authenticate, authorize('admin'), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;
