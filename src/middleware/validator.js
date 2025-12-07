const AppError = require("../utils/AppError");

function validateTransactionBody(requireAllFields = true) {
  return (req, res, next) => {
    const { type, category, amount } = req.body || {};
    const allowed = ["income", "expense"];

    // helper
    const isNonEmptyString = (v) =>
      typeof v === "string" && v.trim().length > 0;
    const hasField = (k) => Object.prototype.hasOwnProperty.call(req.body, k);

    // For create
    if (requireAllFields) {
      if (!isNonEmptyString(type)) {
        return next(
          new AppError("type is required and must be a non-empty string", 400)
        );
      }
      if (!allowed.includes(String(type).toLowerCase())) {
        return next(
          new AppError(`type must be one of: ${allowed.join(", ")}`, 400)
        );
      }

      if (!isNonEmptyString(category)) {
        return next(
          new AppError(
            "category is required and must be a non-empty string",
            400
          )
        );
      }

      if (amount === undefined || amount === null) {
        return next(new AppError("amount is required", 400));
      }
      const num = Number(amount);
      if (Number.isNaN(num)) {
        return next(new AppError("amount must be a number", 400));
      }
      if (num <= 0) {
        return next(new AppError("amount must be greater than zero", 400));
      }

      // normalize amount to number
      req.body.amount = num;
      req.body.type = String(type).toLowerCase();
      req.body.category = String(category).trim();
      return next();
    }

    // For update
    if (!hasField("type") && !hasField("category") && !hasField("amount")) {
      return next(
        new AppError(
          "At least one of type, category or amount must be provided",
          400
        )
      );
    }

    if (hasField("type")) {
      if (!isNonEmptyString(type)) {
        return next(new AppError("type must be a non-empty string", 400));
      }
      if (!allowed.includes(String(type).toLowerCase())) {
        return next(
          new AppError(`type must be one of: ${allowed.join(", ")}`, 400)
        );
      }
      req.body.type = String(type).toLowerCase();
    }

    if (hasField("category")) {
      if (!isNonEmptyString(category)) {
        return next(new AppError("category must be a non-empty string", 400));
      }
      req.body.category = String(category).trim();
    }

    if (hasField("amount")) {
      const num = Number(amount);
      if (Number.isNaN(num)) {
        return next(new AppError("amount must be a number", 400));
      }
      if (num <= 0) {
        return next(new AppError("amount must be greater than zero", 400));
      }
      req.body.amount = num;
    }

    return next();
  };
}

module.exports = {
  validateTransactionBody,
};
