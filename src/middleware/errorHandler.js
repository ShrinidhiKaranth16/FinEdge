// middleware/globalErrorHandler.js
const AppError = require("../utils/AppError");

const sendError = (err, res) => {
  const statusCode = err.statusCode || 500;

  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error("UNEXPECTED ERROR:", err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong.",
  });
};

module.exports = (err, req, res, next) => {
  if (!(err instanceof AppError)) {
    err = new AppError(
      err.message || "Internal Server Error",
      err.statusCode || 500,
      false
    );
  }
  sendError(err, res);
};
