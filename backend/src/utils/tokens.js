const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  || 'edenly_access_secret_change_in_prod';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'edenly_refresh_secret_change_in_prod';

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = () => uuidv4();

const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

const generateResetToken = () => uuidv4().replace(/-/g, '');

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  generateResetToken,
};
