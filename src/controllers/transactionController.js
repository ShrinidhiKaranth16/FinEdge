const transactionService = require("../services/transactionService");
const asyncWrapper = require("../middleware/asyncWrapper");
const AppError = require("../utils/AppError");

class TransactionController {
  create = asyncWrapper(async (req, res, next) => {
    const transaction = await transactionService.createTransaction(req.body);
    return res.status(201).json({ success: true, data: transaction });
  });

  getAll = asyncWrapper(async (req, res, next) => {
    const txns = await transactionService.getAllTransactions();
    return res
      .status(200)
      .json({ success: true, count: txns.length, data: txns });
  });

  getById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const txn = await transactionService.getTransactionById(id);
    if (!txn) throw new AppError("Transaction not found", 404);
    return res.status(200).json({ success: true, data: txn });
  });

  update = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updated = await transactionService.updateTransaction(id, req.body);
    return res.status(200).json({ success: true, data: updated });
  });

  delete = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    await transactionService.deleteTransaction(id);
    return res
      .status(200)
      .json({ success: true, message: "Transaction deleted successfully" });
  });
}

module.exports = new TransactionController();
