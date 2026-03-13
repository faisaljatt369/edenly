const db = require('../db');
const { success, error } = require('../utils/response');

const getOnboardingStatus = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT pp.*, c.name as category_name, c.slug as category_slug
       FROM provider_profiles pp
       LEFT JOIN categories c ON c.id = pp.category_id
       WHERE pp.user_id = $1`,
      [req.user.id]
    );
    if (!rows[0]) return error(res, 'Provider profile not found', 404);
    return success(res, { profile: rows[0] });
  } catch (err) {
    next(err);
  }
};

const saveStep1 = async (req, res, next) => {
  try {
    const { business_name, category_id, description } = req.body;
    const { rows } = await db.query(
      `UPDATE provider_profiles
       SET business_name = $1, category_id = $2, description = $3,
           onboarding_step = GREATEST(onboarding_step, 2), updated_at = NOW()
       WHERE user_id = $4
       RETURNING *`,
      [business_name.trim(), category_id, description?.trim(), req.user.id]
    );
    if (!rows[0]) return error(res, 'Provider profile not found', 404);
    return success(res, { profile: rows[0] });
  } catch (err) {
    next(err);
  }
};

const saveStep2 = async (req, res, next) => {
  try {
    const { address, city, postal_code, country = 'Germany' } = req.body;
    const { rows } = await db.query(
      `UPDATE provider_profiles
       SET address = $1, city = $2, postal_code = $3, country = $4,
           onboarding_step = GREATEST(onboarding_step, 3), updated_at = NOW()
       WHERE user_id = $5
       RETURNING *`,
      [address?.trim(), city.trim(), postal_code.trim(), country.trim(), req.user.id]
    );
    if (!rows[0]) return error(res, 'Provider profile not found', 404);
    return success(res, { profile: rows[0] });
  } catch (err) {
    next(err);
  }
};

const saveStep3 = async (req, res, next) => {
  try {
    // Placeholder — full services/pricing wired in Phase 2
    await db.query(
      `UPDATE provider_profiles
       SET onboarding_step = GREATEST(onboarding_step, 4), updated_at = NOW()
       WHERE user_id = $1`,
      [req.user.id]
    );
    return success(res, { message: 'Step 3 saved. Services will be configured in Phase 2.' });
  } catch (err) {
    next(err);
  }
};

const completeOnboarding = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `UPDATE provider_profiles
       SET is_onboarding_complete = true, onboarding_step = 4, updated_at = NOW()
       WHERE user_id = $1
       RETURNING *`,
      [req.user.id]
    );
    if (!rows[0]) return error(res, 'Provider profile not found', 404);
    return success(res, { profile: rows[0], message: 'Onboarding complete! Your profile is under review.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOnboardingStatus, saveStep1, saveStep2, saveStep3, completeOnboarding };
