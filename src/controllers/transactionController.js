const transactionService = require("../services/transactionService");

class TransactionController {
  create = async (req, res) => {
    try {
      const transaction = await transactionService.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      if (error.errors) return res.status(400).json({ errors: error.errors });
      res.status(400).json({ error: error.message });
    }
  };

  getAll = async (req, res) => {
    const transactions = await transactionService.getAllTransactions();
    console.log(transactions);
    res.json(transactions);
  };

  getById = async (req, res) => {
    const transaction = await transactionService.getTransactionById(
      req.params.id
    );
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  };

  update = async (req, res) => {
    try {
      const updated = await transactionService.updateTransaction(
        req.params.id,
        req.body
      );
      res.json(updated);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const deleted = await transactionService.deleteTransaction(req.params.id);
      res.json(deleted);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  getTotalBalance = async (req, res) => {
    try {
      const balance = await transactionService.getTotalBalance();
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new TransactionController();
