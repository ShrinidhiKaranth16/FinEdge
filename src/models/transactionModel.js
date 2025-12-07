// models/transactionModel.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const AppError = require("../utils/AppError");

class TransactionModel {
  constructor(filePath) {
    this.filePath =
      filePath || path.join(__dirname, "../data/transactions.json");

    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, "[]", "utf8");
    }
  }

  async _readFile() {
    try {
      const raw = await fs.promises.readFile(this.filePath, "utf8");
      console.log(raw);
      return JSON.parse(raw);
    } catch (err) {
      throw new AppError("Failed to read transactions storage", 500);
    }
  }

  async _writeFile(data) {
    try {
      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(data, null, 2),
        "utf8"
      );
    } catch (err) {
      throw new AppError("Failed to write transactions storage", 500);
    }
  }

  async create({ type, category, amount, date }) {
    const txns = await this._readFile();
    const now = new Date();

    const newTxn = {
      id: crypto.randomUUID(),
      type,
      category,
      amount: Number(amount),
      date: date ? new Date(date).toISOString() : now.toISOString(),
      createdAt: now.toISOString(),
    };

    txns.push(newTxn);
    await this._writeFile(txns);
    return newTxn;
  }

  async findAll() {
    return this._readFile();
  }

  async findById(id) {
    const txns = await this._readFile();
    return txns.find((t) => t.id === id) || null;
  }

  async update(id, data) {
    const txns = await this._readFile();
    const idx = txns.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    const updated = {
      ...txns[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    txns[idx] = updated;
    await this._writeFile(txns);
    return updated;
  }

  async delete(id) {
    const txns = await this._readFile();
    const idx = txns.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    const removed = txns.splice(idx, 1)[0];
    await this._writeFile(txns);
    return removed;
  }
}

module.exports = TransactionModel;
