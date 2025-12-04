const transactionModel = require("../models/transactionModel");
const transactionSchema = require("../middleware/validator");

class TransactionService {
  async createTransaction(data) {
    // validate input
    const validatedData = transactionSchema.parse(data);
    return await transactionModel.create(validatedData);
  }

  async getAllTransactions() {
    return await transactionModel.findAll();
  }

  async getTransactionById(id) {
    return await transactionModel.findById(id);
  }

  async updateTransaction(id, data) {
    if (data.amount) data.amount = Number(data.amount);
    if (data.type && !["income", "expense"].includes(data.type))
      throw new Error("Invalid transaction type");
    return await transactionModel.update(id, data);
  }

  async deleteTransaction(id) {
    return await transactionModel.delete(id);
  }
}

module.exports = new TransactionService();
