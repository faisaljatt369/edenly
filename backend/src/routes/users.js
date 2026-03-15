const router = require('express').Router();
const { body } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const {
  getProfile, updateProfile, changePassword,
  getPreferences, updatePreferences,
  createSetupIntent, listPaymentMethods, removePaymentMethod, setDefaultPaymentMethod,
} = require('../controllers/userController');

router.use(authenticate);

router.get('/profile', getProfile);

router.put('/profile', [
  body('first_name').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('last_name').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().trim(),
  body('avatar_url').optional().custom((val) => {
    if (!val) return true;
    const isUrl    = /^https?:\/\/.+/.test(val);
    const isBase64 = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(val);
    if (!isUrl && !isBase64) throw new Error('Avatar must be a URL or base64 image');
    return true;
  }),
], validate, updateProfile);

router.put('/password', [
  body('current_password').notEmpty().withMessage('Current password is required'),
  body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
], validate, changePassword);

router.get('/preferences',  getPreferences);
router.put('/preferences',  updatePreferences);

// Stripe payment methods
router.post('/stripe/setup-intent',                           createSetupIntent);
router.get('/stripe/payment-methods',                        listPaymentMethods);
router.delete('/stripe/payment-methods/:pmId',               removePaymentMethod);
router.put('/stripe/payment-methods/:pmId/default',          setDefaultPaymentMethod);

module.exports = router;
