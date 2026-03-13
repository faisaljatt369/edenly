const db = require('../db');
const { success, error } = require('../utils/response');

const listRoles = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM roles ORDER BY id ASC');
    return success(res, { roles: rows });
  } catch (err) { next(err); }
};

const createRole = async (req, res, next) => {
  try {
    const { name, description, permissions = {} } = req.body;
    const { rows } = await db.query(
      'INSERT INTO roles (name, description, permissions) VALUES ($1, $2, $3) RETURNING *',
      [name.toLowerCase().trim(), description, JSON.stringify(permissions)]
    );
    return success(res, { role: rows[0] }, 201);
  } catch (err) { next(err); }
};

const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;
    const { rows } = await db.query(
      `UPDATE roles SET
        name        = COALESCE($1, name),
        description = COALESCE($2, description),
        permissions = COALESCE($3, permissions),
        updated_at  = NOW()
       WHERE id = $4 RETURNING *`,
      [name, description, permissions ? JSON.stringify(permissions) : null, id]
    );
    if (!rows[0]) return error(res, 'Role not found', 404);
    return success(res, { role: rows[0] });
  } catch (err) { next(err); }
};

const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const protected_roles = ['customer', 'provider', 'admin'];
    const { rows } = await db.query('SELECT name FROM roles WHERE id = $1', [id]);
    if (!rows[0]) return error(res, 'Role not found', 404);
    if (protected_roles.includes(rows[0].name)) return error(res, 'Cannot delete system roles', 400);
    await db.query('DELETE FROM roles WHERE id = $1', [id]);
    return success(res, { message: 'Role deleted' });
  } catch (err) { next(err); }
};

module.exports = { listRoles, createRole, updateRole, deleteRole };
