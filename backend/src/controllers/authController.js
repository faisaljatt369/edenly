const db = require('../db');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken, generateResetToken } = require('../utils/tokens');
const { success, error } = require('../utils/response');

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

// ── Register ─────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, role = 'customer' } = req.body;

    // Check email unique
    const exists = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (exists.rows.length > 0) return error(res, 'Email is already registered', 409);

    // Validate role
    const validRoles = ['customer', 'provider'];
    if (!validRoles.includes(role)) return error(res, 'Invalid role', 400);

    const passwordHash = await hashPassword(password);

    // Insert user
    const { rows } = await db.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, is_email_verified, is_active, updated_at)
       VALUES ($1, $2, $3, $4, $5, false, true, NOW())
       RETURNING id, first_name, last_name, email, role, is_email_verified, created_at`,
      [first_name.trim(), last_name.trim(), email.toLowerCase().trim(), passwordHash, role]
    );
    const user = rows[0];

    // Create provider_profile row if provider
    if (role === 'provider') {
      await db.query(
        'INSERT INTO provider_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
        [user.id]
      );
    }

    // Email verification token (console-log for now)
    const verifyToken = generateResetToken();
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await db.query(
      'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, verifyToken, verifyExpires]
    );
    console.log(`\n[EMAIL VERIFY] User: ${email} | Token: ${verifyToken}\n`);

    // Issue tokens
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, refreshExpires]
    );

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    return success(res, { accessToken, user }, 201);
  } catch (err) {
    next(err);
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { rows } = await db.query(
      'SELECT id, first_name, last_name, email, password_hash, role, is_active, is_email_verified FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    const user = rows[0];
    if (!user) return error(res, 'Invalid email or password', 401);
    if (!user.is_active) return error(res, 'Your account has been deactivated', 403);

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) return error(res, 'Invalid email or password', 401);

    const { password_hash, ...safeUser } = user;

    const accessToken  = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken();
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Clean old refresh tokens for this user
    await db.query('DELETE FROM refresh_tokens WHERE user_id = $1 AND expires_at < NOW()', [user.id]);
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, refreshExpires]
    );

    // Get provider onboarding status if provider
    let providerProfile = null;
    if (safeUser.role === 'provider') {
      const pp = await db.query(
        'SELECT is_onboarding_complete, onboarding_step FROM provider_profiles WHERE user_id = $1',
        [user.id]
      );
      providerProfile = pp.rows[0] || null;
    }

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    return success(res, { accessToken, user: safeUser, providerProfile });
  } catch (err) {
    next(err);
  }
};

// ── Logout ────────────────────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
    }
    res.clearCookie('refreshToken', { path: '/' });
    return success(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// ── Refresh Token ─────────────────────────────────────────────────────────────
const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return error(res, 'No refresh token', 401);

    const { rows } = await db.query(
      `SELECT rt.*, u.id as user_id, u.email, u.role, u.first_name, u.last_name, u.is_active
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token = $1 AND rt.expires_at > NOW()`,
      [token]
    );
    const record = rows[0];
    if (!record) return error(res, 'Invalid or expired refresh token', 401);
    if (!record.is_active) return error(res, 'Account deactivated', 403);

    // Rotate refresh token
    await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
    const newRefresh = generateRefreshToken();
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [record.user_id, newRefresh, refreshExpires]
    );

    const user = { id: record.user_id, email: record.email, role: record.role };
    const accessToken = generateAccessToken(user);

    res.cookie('refreshToken', newRefresh, REFRESH_COOKIE_OPTIONS);
    return success(res, { accessToken, user: { ...user, first_name: record.first_name, last_name: record.last_name } });
  } catch (err) {
    next(err);
  }
};

// ── Forgot Password ───────────────────────────────────────────────────────────
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);

    // Always return success to prevent email enumeration
    if (rows.length === 0) {
      return success(res, { message: 'If that email exists, a reset link has been sent.' });
    }
    const userId = rows[0].id;

    // Invalidate old tokens
    await db.query('UPDATE password_reset_tokens SET used = true WHERE user_id = $1 AND used = false', [userId]);

    const token = generateResetToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await db.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expires]
    );

    console.log(`\n[PASSWORD RESET] Email: ${email} | Token: ${token}\n`);
    console.log(`[PASSWORD RESET] Link: http://localhost:5178/reset-password?token=${token}\n`);

    return success(res, { message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

// ── Reset Password ────────────────────────────────────────────────────────────
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const { rows } = await db.query(
      'SELECT * FROM password_reset_tokens WHERE token = $1 AND used = false AND expires_at > NOW()',
      [token]
    );
    if (rows.length === 0) return error(res, 'Reset token is invalid or has expired', 400);

    const { user_id } = rows[0];
    const passwordHash = await hashPassword(password);

    await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [passwordHash, user_id]);
    await db.query('UPDATE password_reset_tokens SET used = true WHERE token = $1', [token]);
    await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user_id]);

    return success(res, { message: 'Password has been reset. Please log in.' });
  } catch (err) {
    next(err);
  }
};

// ── Verify Email ──────────────────────────────────────────────────────────────
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const { rows } = await db.query(
      'SELECT * FROM email_verification_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    if (rows.length === 0) return error(res, 'Verification token is invalid or has expired', 400);

    const { user_id } = rows[0];
    await db.query('UPDATE users SET is_email_verified = true, updated_at = NOW() WHERE id = $1', [user_id]);
    await db.query('DELETE FROM email_verification_tokens WHERE user_id = $1', [user_id]);

    return success(res, { message: 'Email verified successfully.' });
  } catch (err) {
    next(err);
  }
};

// ── Me ────────────────────────────────────────────────────────────────────────
const me = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, first_name, last_name, email, role, phone, avatar_url, is_email_verified, is_active, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    if (rows.length === 0) return error(res, 'User not found', 404);
    return success(res, { user: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, refresh, forgotPassword, resetPassword, verifyEmail, me };
