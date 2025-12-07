// services/transactionService.js
const TransactionModel = require("../models/transactionModel");
const AppError = require("../utils/AppError");

const validTypes = ["income", "expense"];

class TransactionService {
  constructor(modelInstance) {
    // allow injection; default to file-backed model
    this.model = modelInstance || new TransactionModel();
  }

  async createTransaction(data) {
    // business validation
    if (!data || typeof data !== "object") {
      throw new AppError("Invalid payload", 400);
    }

    const type = String(data.type).toLowerCase();
    if (!validTypes.includes(type)) {
      throw new AppError("Invalid transaction type", 400);
    }

    const amount = Number(data.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      throw new AppError("Amount must be a positive number", 400);
    }

    const payload = {
      type,
      category: String(data.category).trim(),
      amount,
      date: data.date, // optional
    };

    return this.model.create(payload);
  }

  async getAllTransactions() {
    return this.model.findAll();
  }

  async getTransactionById(id) {
    if (!id) throw new AppError("id is required", 400);
    return this.model.findById(id);
  }

  async updateTransaction(id, data) {
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

    const existing = await this.model.findById(id);
    if (!existing) {
      throw new AppError(`Transaction with ID ${id} not found`, 404);
    }

    return this.model.update(id, data);
  }

  async deleteTransaction(id) {
    if (!id) throw new AppError("id is required", 400);
    const existing = await this.model.findById(id);
    if (!existing) {
      throw new AppError(`Transaction with ID ${id} not found`, 404);
    }
    return this.model.delete(id);
  }
}

// default singleton
const defaultService = new TransactionService();
module.exports = defaultService;
// also export class for tests / DI
module.exports.TransactionService = TransactionService;
