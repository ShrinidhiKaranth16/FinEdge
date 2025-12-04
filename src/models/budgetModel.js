const { v4: uuidv4 } = require("uuid");

class Budget {
  constructor(monthlyLimit, savingsTarget) {
    if (typeof monthlyLimit !== "number") {
      throw new Error("monthlyLimit must be a number");
    }

    if (typeof savingsTarget !== "number") {
      throw new Error("savingsTarget must be a number");
    }

    this.id = uuidv4();
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
        throw new Error("monthlyLimit must be a number");
      }
      this.monthlyLimit = values.monthlyLimit;
    }

    if (values.savingsTarget !== undefined) {
      if (typeof values.savingsTarget !== "number") {
        throw new Error("savingsTarget must be a number");
      }
      this.savingsTarget = values.savingsTarget;
    }
  }
}

module.exports = Budget;
