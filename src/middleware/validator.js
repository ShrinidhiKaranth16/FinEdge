const AppError = require('../utils/AppError');

function isValidEmail(email) {
  // simple regex; good enough for demo
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.validateUser = (req, res, next) => {
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return next(new AppError('Name is required', 400));
  }
  if (!email || !isValidEmail(email)) {
    return next(new AppError('Valid email is required', 400));
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return next(new AppError('Password is required and must be at least 6 characters', 400));
  }
  next();
};
