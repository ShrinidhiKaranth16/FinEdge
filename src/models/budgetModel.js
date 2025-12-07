const crypto = require("crypto");
const AppError = require("../utils/AppError");

class Budget {
  constructor(monthlyLimit, savingsTarget) {
    if (typeof monthlyLimit !== "number") {
      throw new AppError("monthlyLimit must be a number", 400);
    }

    if (typeof savingsTarget !== "number") {
      throw new AppError("savingsTarget must be a number", 400);
    }

    this.id = crypto.randomUUID();
    this.monthlyLimit = monthlyLimit;
    this.savingsTarget = savingsTarget;
    this.createdAt = new Date().toISOString();
  }

  getSavingsPercentage() {
    return (this.savingsTarget / this.monthlyLimit) * 100;
  }
  update(values) {
    if (values.monthlyLimit !== undefined) {
      if (typeof values.monthlyLimit !== "number") {
        throw new AppError("monthlyLimit must be a number", 400);
      }
      this.monthlyLimit = values.monthlyLimit;
    }

    if (values.savingsTarget !== undefined) {
      if (typeof values.savingsTarget !== "number") {
        throw new AppError("savingsTarget must be a number", 400);
      }
      this.savingsTarget = values.savingsTarget;
    }
  }
}

module.exports = Budget;
