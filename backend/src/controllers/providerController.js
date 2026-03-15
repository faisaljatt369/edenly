const db = require('../db');
const { success, error } = require('../utils/response');

// ── helpers ───────────────────────────────────────────────────────────────────
const getProfile = async (userId) => {
  const { rows } = await db.query(
    'SELECT * FROM provider_profiles WHERE user_id = $1',
    [userId]
  );
  return rows[0] || null;
};

// ── GET /api/providers/onboarding/status ─────────────────────────────────────
const getOnboardingStatus = async (req, res, next) => {
  try {
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);

    const [cats, services, availability, blocked, portfolio] = await Promise.all([
      db.query('SELECT category_id FROM provider_categories WHERE provider_id = $1', [pp.id]),
      db.query(`
        SELECT ps.*, COALESCE(json_agg(sv ORDER BY sv.sort_order) FILTER (WHERE sv.id IS NOT NULL), '[]') AS variants
        FROM provider_services ps
        LEFT JOIN service_variants sv ON sv.service_id = ps.id
        WHERE ps.provider_id = $1 AND ps.is_active = true
        GROUP BY ps.id ORDER BY ps.sort_order
      `, [pp.id]),
      db.query('SELECT * FROM provider_availability WHERE provider_id = $1 ORDER BY day_of_week', [pp.id]),
      db.query('SELECT * FROM provider_blocked_times WHERE provider_id = $1 ORDER BY date', [pp.id]),
      db.query('SELECT * FROM provider_portfolio WHERE provider_id = $1 ORDER BY sort_order', [pp.id]),
    ]);

    return success(res, {
      profile: pp,
      categories: cats.rows.map((r) => r.category_id),
      services: services.rows,
      availability: availability.rows,
      blocked_times: blocked.rows,
      portfolio: portfolio.rows,
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/providers/onboarding/location ────────────────────────────────────
const saveLocation = async (req, res, next) => {
  try {
    const { city, address, postal_code, country = 'Germany' } = req.body;
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);

    await db.query(
      `UPDATE provider_profiles SET city=$1, address=$2, postal_code=$3, country=$4,
       onboarding_step=GREATEST(onboarding_step, 2), updated_at=NOW()
       WHERE id=$5`,
      [city, address, postal_code, country, pp.id]
    );
    return success(res, { message: 'Location saved' });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/providers/onboarding/social ─────────────────────────────────────
const saveSocial = async (req, res, next) => {
  try {
    const { instagram = null, tiktok = null } = req.body;
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);

    await db.query(
      `UPDATE provider_profiles SET instagram=$1, tiktok=$2,
       onboarding_step=GREATEST(onboarding_step, 3), updated_at=NOW()
       WHERE id=$3`,
      [instagram || null, tiktok || null, pp.id]
    );
    return success(res, { message: 'Social links saved' });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/providers/onboarding/categories ──────────────────────────────────
const saveCategories = async (req, res, next) => {
  try {
    const { category_ids = [] } = req.body;
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);
    if (!category_ids.length) return error(res, 'Select at least one category', 422);

    await db.query('DELETE FROM provider_categories WHERE provider_id = $1', [pp.id]);
    for (const cid of category_ids) {
      await db.query(
        'INSERT INTO provider_categories (provider_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [pp.id, cid]
      );
    }
    await db.query(
      `UPDATE provider_profiles SET onboarding_step=GREATEST(onboarding_step, 4), updated_at=NOW() WHERE id=$1`,
      [pp.id]
    );
    return success(res, { message: 'Categories saved' });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/providers/onboarding/services ────────────────────────────────────
const saveServices = async (req, res, next) => {
  try {
    const { services = [] } = req.body;
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);

    for (const svc of services) {
      const isCustom   = svc.is_custom || false;
      const isApproved = !isCustom;
      let serviceId    = svc.id;

      const imagesArr       = Array.isArray(svc.images) ? svc.images : [];
      const titleImageIndex = typeof svc.title_image_index === 'number' ? svc.title_image_index : 0;

      if (serviceId) {
        await db.query(
          `UPDATE provider_services SET category_id=$1, name=$2, price=$3, duration=$4,
           description=$5, images=$6::jsonb, title_image_index=$7, updated_at=NOW()
           WHERE id=$8 AND provider_id=$9`,
          [svc.category_id || null, svc.name, svc.price || null, svc.duration || null,
           svc.description || null, JSON.stringify(imagesArr), titleImageIndex, serviceId, pp.id]
        );
      } else {
        const { rows } = await db.query(
          `INSERT INTO provider_services
           (provider_id, category_id, name, price, duration, description, images, title_image_index, is_custom, is_approved)
           VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10) RETURNING id`,
          [pp.id, svc.category_id || null, svc.name, svc.price || null,
           svc.duration || null, svc.description || null, JSON.stringify(imagesArr), titleImageIndex, isCustom, isApproved]
        );
        serviceId = rows[0].id;
      }

      if (Array.isArray(svc.variants)) {
        await db.query('DELETE FROM service_variants WHERE service_id = $1', [serviceId]);
        for (let i = 0; i < svc.variants.length; i++) {
          const v = svc.variants[i];
          await db.query(
            'INSERT INTO service_variants (service_id, name, price, duration, sort_order) VALUES ($1,$2,$3,$4,$5)',
            [serviceId, v.name, v.price || 0, v.duration || 60, i]
          );
        }
      }
    }

    await db.query(
      `UPDATE provider_profiles SET onboarding_step=GREATEST(onboarding_step, 5), updated_at=NOW() WHERE id=$1`,
      [pp.id]
    );
    return success(res, { message: 'Services saved' });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/providers/onboarding/services/:id ────────────────────────────
const deleteService = async (req, res, next) => {
  try {
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);
    await db.query(
      'UPDATE provider_services SET is_active=false, updated_at=NOW() WHERE id=$1 AND provider_id=$2',
      [req.params.id, pp.id]
    );
    return success(res, { message: 'Service removed' });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/providers/onboarding/availability ───────────────────────────────
const saveAvailability = async (req, res, next) => {
  try {
    const { buffer_time = 0, availability = [] } = req.body;
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);

    await db.query(
      'UPDATE provider_profiles SET buffer_time=$1, onboarding_step=GREATEST(onboarding_step, 6), updated_at=NOW() WHERE id=$2',
      [buffer_time, pp.id]
    );
    for (const slot of availability) {
      await db.query(
        `INSERT INTO provider_availability (provider_id, day_of_week, start_time, end_time, is_active)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (provider_id, day_of_week) DO UPDATE SET start_time=$3, end_time=$4, is_active=$5`,
        [pp.id, slot.day_of_week, slot.start_time, slot.end_time, slot.is_active !== false]
      );
    }
    return success(res, { message: 'Availability saved' });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/providers/onboarding/blocked-times ──────────────────────────────
const saveBlockedTimes = async (req, res, next) => {
  try {
    const { blocked_times = [] } = req.body;
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);

    await db.query('DELETE FROM provider_blocked_times WHERE provider_id = $1', [pp.id]);
    for (const bt of blocked_times) {
      await db.query(
        'INSERT INTO provider_blocked_times (provider_id, date, start_time, end_time, note) VALUES ($1,$2,$3,$4,$5)',
        [pp.id, bt.date, bt.start_time || null, bt.end_time || null, bt.note || null]
      );
    }
    await db.query(
      `UPDATE provider_profiles SET onboarding_step=GREATEST(onboarding_step, 7), updated_at=NOW() WHERE id=$1`,
      [pp.id]
    );
    return success(res, { message: 'Blocked times saved' });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/providers/onboarding/policies ───────────────────────────────────
const savePolicies = async (req, res, next) => {
  try {
    const { cancellation_policy = '24h', deposit_type = 'none', deposit_value = 0 } = req.body;
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);

    await db.query(
      `UPDATE provider_profiles SET cancellation_policy=$1, deposit_type=$2, deposit_value=$3,
       onboarding_step=GREATEST(onboarding_step, 8), updated_at=NOW()
       WHERE id=$4`,
      [cancellation_policy, deposit_type, deposit_value, pp.id]
    );
    return success(res, { message: 'Policies saved' });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/providers/onboarding/description ────────────────────────────────
const saveDescription = async (req, res, next) => {
  try {
    const { description, service_type = 'studio' } = req.body;
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);

    await db.query(
      `UPDATE provider_profiles SET description=$1, service_type=$2,
       onboarding_step=GREATEST(onboarding_step, 9), updated_at=NOW()
       WHERE id=$3`,
      [description, service_type, pp.id]
    );
    return success(res, { message: 'Description saved' });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/providers/onboarding/complete ──────────────────────────────────
const completeOnboarding = async (req, res, next) => {
  try {
    const pp = await getProfile(req.user.id);
    if (!pp) return error(res, 'Provider profile not found', 404);

    await db.query(
      `UPDATE provider_profiles SET is_onboarding_complete=true, is_active=true,
       onboarding_step=10, updated_at=NOW() WHERE id=$1`,
      [pp.id]
    );
    return success(res, { message: 'Profile is now live!' });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/categories (public) ─────────────────────────────────────────────
const listCategories = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, slug, icon FROM categories WHERE is_active=true ORDER BY sort_order'
    );
    return success(res, { categories: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
  listCategories,
};
