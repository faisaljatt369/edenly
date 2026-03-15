const db     = require('../db');
const { success, error } = require('../utils/response');
const { hashPassword, comparePassword } = require('../utils/hash');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const getProfile = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, first_name, last_name, email, role, phone, avatar_url, is_email_verified, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    if (!rows[0]) return error(res, 'User not found', 404);
    return success(res, { user: rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, phone, avatar_url } = req.body;
    const { rows } = await db.query(
      `UPDATE users
       SET first_name = COALESCE($1, first_name),
           last_name  = COALESCE($2, last_name),
           phone      = COALESCE($3, phone),
           avatar_url = COALESCE($4, avatar_url),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, first_name, last_name, email, role, phone, avatar_url, is_email_verified`,
      [first_name, last_name, phone, avatar_url, req.user.id]
    );
    return success(res, { user: rows[0] });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    const { rows } = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows[0]) return error(res, 'User not found', 404);

    const valid = await comparePassword(current_password, rows[0].password_hash);
    if (!valid) return error(res, 'Current password is incorrect', 400);

    const hash = await hashPassword(new_password);
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hash, req.user.id]
    );

    return success(res, { message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

const getPreferences = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT notifications, privacy FROM user_preferences WHERE user_id = $1`,
      [req.user.id]
    );
    if (!rows[0]) {
      // Auto-create with defaults
      const inserted = await db.query(
        `INSERT INTO user_preferences (user_id) VALUES ($1)
         RETURNING notifications, privacy`,
        [req.user.id]
      );
      return success(res, { preferences: inserted.rows[0] });
    }
    return success(res, { preferences: rows[0] });
  } catch (err) {
    next(err);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const { notifications, privacy } = req.body;
    const { rows } = await db.query(
      `INSERT INTO user_preferences (user_id, notifications, privacy, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id) DO UPDATE
         SET notifications = COALESCE($2, user_preferences.notifications),
             privacy       = COALESCE($3, user_preferences.privacy),
             updated_at    = NOW()
       RETURNING notifications, privacy`,
      [req.user.id, notifications ? JSON.stringify(notifications) : null, privacy ? JSON.stringify(privacy) : null]
    );
    return success(res, { preferences: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── Stripe: ensure customer exists ───────────────────────────────────────────
const ensureStripeCustomer = async (userId, email) => {
  const { rows } = await db.query('SELECT stripe_customer_id FROM users WHERE id=$1', [userId]);
  if (rows[0]?.stripe_customer_id) return rows[0].stripe_customer_id;
  const customer = await stripe.customers.create({ email, metadata: { user_id: String(userId) } });
  await db.query('UPDATE users SET stripe_customer_id=$1 WHERE id=$2', [customer.id, userId]);
  return customer.id;
};

// ── POST /api/users/stripe/setup-intent ──────────────────────────────────────
const createSetupIntent = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT email, stripe_customer_id FROM users WHERE id=$1', [req.user.id]);
    const user = rows[0];
    if (!user) return error(res, 'User not found', 404);
    const customerId = await ensureStripeCustomer(req.user.id, user.email);
    const intent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });
    return success(res, { client_secret: intent.client_secret });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/stripe/payment-methods ────────────────────────────────────
const listPaymentMethods = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT email, stripe_customer_id FROM users WHERE id=$1', [req.user.id]);
    const user = rows[0];
    if (!user) return error(res, 'User not found', 404);
    if (!user.stripe_customer_id) return success(res, { payment_methods: [] });
    const pms = await stripe.paymentMethods.list({ customer: user.stripe_customer_id, type: 'card' });
    // Get default payment method
    const customer = await stripe.customers.retrieve(user.stripe_customer_id);
    const defaultPmId = customer.invoice_settings?.default_payment_method;
    const methods = pms.data.map((pm) => ({
      id: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      exp_month: pm.card.exp_month,
      exp_year: pm.card.exp_year,
      is_default: pm.id === defaultPmId,
    }));
    return success(res, { payment_methods: methods });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/users/stripe/payment-methods/:pmId ───────────────────────────
const removePaymentMethod = async (req, res, next) => {
  try {
    await stripe.paymentMethods.detach(req.params.pmId);
    return success(res, { message: 'Card removed' });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/users/stripe/payment-methods/:pmId/default ──────────────────────
const setDefaultPaymentMethod = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT stripe_customer_id FROM users WHERE id=$1', [req.user.id]);
    if (!rows[0]?.stripe_customer_id) return error(res, 'No Stripe customer', 400);
    await stripe.customers.update(rows[0].stripe_customer_id, {
      invoice_settings: { default_payment_method: req.params.pmId },
    });
    return success(res, { message: 'Default card updated' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile, updateProfile, changePassword,
  getPreferences, updatePreferences,
  createSetupIntent, listPaymentMethods, removePaymentMethod, setDefaultPaymentMethod,
};
