const router = require('express').Router();
const { body } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { listRoles, createRole, updateRole, deleteRole } = require('../controllers/roleController');

router.use(authenticate, authorize('admin'));

router.get('/',     listRoles);
router.post('/',    [body('name').trim().notEmpty().withMessage('Name is required')], validate, createRole);
router.put('/:id',  updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
