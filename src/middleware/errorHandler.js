// Global error handler
const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  if (!err) return next();

  // ensure standard format
  if (!(err instanceof AppError)) {
    console.error('Unexpected error: ', err);
    err = new AppError('Internal Server Error', 500);
  }

  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong'
  });
};
