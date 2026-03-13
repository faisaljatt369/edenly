const db = require('../db');
const { success, error } = require('../utils/response');

const listCategories = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC, name ASC'
    );
    return success(res, { categories: rows });
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, slug, icon, sort_order = 0 } = req.body;
    const { rows } = await db.query(
      'INSERT INTO categories (name, slug, icon, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.trim(), slug.toLowerCase().trim(), icon, sort_order]
    );
    return success(res, { category: rows[0] }, 201);
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, icon, sort_order, is_active } = req.body;
    const { rows } = await db.query(
      `UPDATE categories SET
        name       = COALESCE($1, name),
        slug       = COALESCE($2, slug),
        icon       = COALESCE($3, icon),
        sort_order = COALESCE($4, sort_order),
        is_active  = COALESCE($5, is_active),
        updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [name, slug, icon, sort_order, is_active, id]
    );
    if (!rows[0]) return error(res, 'Category not found', 404);
    return success(res, { category: rows[0] });
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE categories SET is_active = false, updated_at = NOW() WHERE id = $1', [id]);
    return success(res, { message: 'Category deactivated' });
  } catch (err) { next(err); }
};

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
