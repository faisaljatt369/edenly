const router = require('express').Router();
const { body } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const {
  getOnboardingStatus, saveStep1, saveStep2, saveStep3, completeOnboarding,
} = require('../controllers/providerController');

router.use(authenticate, authorize('provider'));

router.get('/onboarding', getOnboardingStatus);

router.post('/onboarding/1', [
  body('business_name').trim().notEmpty().withMessage('Business name is required'),
  body('category_id').isInt({ min: 1 }).withMessage('Category is required'),
  body('description').optional().trim(),
], validate, saveStep1);

router.post('/onboarding/2', [
  body('city').trim().notEmpty().withMessage('City is required'),
  body('postal_code').trim().notEmpty().withMessage('Postal code is required'),
  body('country').optional().trim(),
  body('address').optional().trim(),
], validate, saveStep2);

router.post('/onboarding/3', saveStep3);

router.post('/onboarding/complete', completeOnboarding);

module.exports = router;
