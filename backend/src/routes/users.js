const router = require('express').Router();
const { body } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { getProfile, updateProfile } = require('../controllers/userController');

router.use(authenticate);

router.get('/profile', getProfile);

router.put('/profile', [
  body('first_name').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('last_name').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().trim(),
  body('avatar_url').optional().isURL().withMessage('Avatar must be a valid URL'),
], validate, updateProfile);

module.exports = router;
