const AppError = require("../utils/AppError");

function errorHandler(err, req, res, next) {
  if (!err) return next();

  // Zod validation error → 400
  if (err?.errors) {
    return res.status(400).json({
      status: "fail",
      errors: err.errors,
    });
  }

  // ensure standard format
  if (!(err instanceof AppError)) {
    console.error("Unexpected error: ", err);
    err = new AppError("Internal Server Error", 500);
  }

  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Something went wrong",
  });
}

module.exports = errorHandler;
