const TransactionModel = require("../models/transactionModel");
const AppError = require("../utils/AppError");

const validTypes = ["income", "expense"];

class TransactionService {
  constructor(modelInstance) {
    // allow injection; default to file-backed model
    this.model = modelInstance || new TransactionModel();
  }

  // data is expected to include userId (for create)
  async createTransaction(data) {
    if (!data || typeof data !== "object") {
      throw new AppError("Invalid payload", 400);
    }

    const type = String(data.type || "").toLowerCase();
    if (!validTypes.includes(type)) {
      throw new AppError("Invalid transaction type", 400);
    }

    const amount = Number(data.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      throw new AppError("Amount must be a positive number", 400);
    }

    if (!data.userId) {
      throw new AppError("userId is required", 400);
    }

    const payload = {
      type,
      category: String(data.category || "").trim(),
      amount,
      userId: data.userId,
    };

    return this.model.create(payload);
  }

  // userId required
  async getAllTransactions(userId) {
    if (!userId) throw new AppError("userId is required", 400);
    return this.model.findAll(userId);
  }

  async getTransactionById(userId, id) {
    if (!userId) throw new AppError("userId is required", 400);
    if (!id) throw new AppError("id is required", 400);
    return this.model.findById(userId, id);
  }

  async updateTransaction(userId, id, data) {
    if (!userId) throw new AppError("userId is required", 400);
    if (!id) throw new AppError("id is required", 400);
    if (!data || typeof data !== "object")
      throw new AppError("Invalid payload", 400);

    if (data.type && !validTypes.includes(String(data.type).toLowerCase())) {
      throw new AppError("Invalid transaction type", 400);
    }

    if (data.amount !== undefined) {
      const num = Number(data.amount);
      if (Number.isNaN(num) || num <= 0) {
        throw new AppError("Amount must be a positive number", 400);
      }
      data.amount = num;
    }

    const existing = await this.model.findById(userId, id);
    if (!existing) {
      throw new AppError(`Transaction with ID ${id} not found`, 404);
    }

    return this.model.update(userId, id, data);
  }

  async deleteTransaction(userId, id) {
    if (!userId) throw new AppError("userId is required", 400);
    if (!id) throw new AppError("id is required", 400);

    const existing = await this.model.findById(userId, id);
    if (!existing) {
      throw new AppError(`Transaction with ID ${id} not found`, 404);
    }

    return this.model.delete(userId, id);
  }
}

module.exports = new TransactionService();
