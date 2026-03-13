const db = require('../db');
const { success, error } = require('../utils/response');

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

module.exports = { getProfile, updateProfile };
