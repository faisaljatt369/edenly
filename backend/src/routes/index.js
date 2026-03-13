const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth',       require('./auth'));
router.use('/users',      require('./users'));
router.use('/providers',  require('./providers'));
router.use('/roles',      require('./roles'));
router.use('/categories', require('./categories'));

module.exports = router;
