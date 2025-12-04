const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function generateUUID() {
  return crypto.randomUUID(); // Generates a cryptographically secure UUID v4
}

class TransactionModel {
  constructor() {
    this.filePath = path.join(__dirname, "../data/transactions.json");
  }

  async _readFile() {
    const data = await fs.promises.readFile(this.filePath, "utf-8");
    console.log(data);
    return JSON.parse(data);
  }

  async _writeFile(data) {
    await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async create({ type, category, amount }) {
    const transactions = await this._readFile();
    const newTransaction = {
      id: generateUUID(),
      type,
      category,
      amount: Number(amount),
      date: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    await this._writeFile(transactions);
    return newTransaction;
  }

  async findAll() {
    return this._readFile();
  }

  async findById(id) {
    const transactions = await this._readFile();
    return transactions.find((t) => t.id === id);
  }

  async update(id, data) {
    const transactions = await this._readFile();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Transaction not found");
    transactions[index] = { ...transactions[index], ...data };
    await this._writeFile(transactions);
    return transactions[index];
  }

  async delete(id) {
    const transactions = await this._readFile();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Transaction not found");
    const removed = transactions.splice(index, 1)[0];
    await this._writeFile(transactions);
    return removed;
  }
}

module.exports = new TransactionModel();
