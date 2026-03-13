const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.message);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
  if (err.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({ success: false, message: 'Resource already exists' });
  }
  if (err.code === '23503') { // PostgreSQL FK violation
    return res.status(400).json({ success: false, message: 'Invalid reference' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
