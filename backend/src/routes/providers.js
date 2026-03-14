const router = require('express').Router();
const { body } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const validate     = require('../middleware/validate');
const {
  getOnboardingStatus,
  saveLocation,
  saveSocial,
  saveCategories,
  saveServices,
  deleteService,
  saveAvailability,
  saveBlockedTimes,
  savePolicies,
  saveDescription,
  completeOnboarding,
} = require('../controllers/providerController');

router.use(authenticate, authorize('provider'));

router.get('/onboarding/status', getOnboardingStatus);

router.put('/onboarding/location', [
  body('city').trim().notEmpty().withMessage('City is required'),
  body('postal_code').trim().notEmpty().withMessage('Postal code is required'),
  body('address').optional().trim(),
  body('country').optional().trim(),
], validate, saveLocation);

router.put('/onboarding/social', [
  body('instagram').optional({ nullable: true }).trim(),
  body('tiktok').optional({ nullable: true }).trim(),
], validate, saveSocial);

router.put('/onboarding/categories', [
  body('category_ids').isArray({ min: 1 }).withMessage('Select at least one category'),
], validate, saveCategories);

router.put('/onboarding/services', [
  body('services').isArray().withMessage('Services must be an array'),
], validate, saveServices);

router.delete('/onboarding/services/:id', deleteService);

router.put('/onboarding/availability', [
  body('buffer_time').optional().isInt({ min: 0 }),
  body('availability').isArray(),
], validate, saveAvailability);

router.put('/onboarding/blocked-times', [
  body('blocked_times').isArray(),
], validate, saveBlockedTimes);

router.put('/onboarding/policies', [
  body('cancellation_policy').optional().isIn(['24h', '72h']),
  body('deposit_type').optional().isIn(['none', 'fixed', 'percentage']),
  body('deposit_value').optional().isFloat({ min: 0 }),
], validate, savePolicies);

router.put('/onboarding/description', [
  body('description').optional().trim(),
  body('service_type').optional().isIn(['studio', 'mobile', 'both']),
], validate, saveDescription);

router.post('/onboarding/complete', completeOnboarding);

module.exports = router;
