const router = require('express').Router();
const { body } = require('express-validator');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const {
  register, login, logout, refresh,
  forgotPassword, resetPassword, verifyEmail, me,
} = require('../controllers/authController');

const strongPassword = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters');

router.post('/register', authLimiter, [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  strongPassword,
  body('role').optional().isIn(['customer', 'provider']).withMessage('Invalid role'),
], validate, register);

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], validate, login);

router.post('/logout', logout);

router.post('/refresh', refresh);

router.post('/forgot-password', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
], validate, forgotPassword);

router.post('/reset-password', authLimiter, [
  body('token').notEmpty().withMessage('Token is required'),
  strongPassword,
], validate, resetPassword);

router.post('/verify-email', [
  body('token').notEmpty().withMessage('Token is required'),
], validate, verifyEmail);

router.get('/me', authenticate, me);

module.exports = router;
