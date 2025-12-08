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
      return JSON.parse(raw || "[]");
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

  // Create transaction: adds to full array
  async create({ type, category, amount, userId }) {
    const all = await this._readFile();

    const newTxn = {
      id: crypto.randomUUID(),
      type,
      category,
      amount: Number(amount),
      date: new Date().toISOString(),
      userId,
      createdAt: new Date().toISOString(),
    };

    all.push(newTxn);
    await this._writeFile(all);
    return newTxn;
  }

  // Return all transactions for a user
  async findAll(userId) {
    const all = await this._readFile();
    return all.filter((txn) => txn.userId === userId);
  }

  // Find a single transaction by userId and id
  async findById(userId, id) {
    const all = await this._readFile();
    return all.find((t) => t.id === id && t.userId === userId) || null;
  }

  // Update a transaction: must update full array and persist
  async update(userId, id, data) {
    const all = await this._readFile();
    const idx = all.findIndex((t) => t.id === id && t.userId === userId);
    if (idx === -1) return null;

    const updated = {
      ...all[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    all[idx] = updated;
    await this._writeFile(all);
    return updated;
  }

  // Delete a transaction and return removed
  async delete(userId, id) {
    const all = await this._readFile();
    const idx = all.findIndex((t) => t.id === id && t.userId === userId);
    if (idx === -1) return null;

    const [removed] = all.splice(idx, 1);
    await this._writeFile(all);
    return removed;
  }
}

module.exports = TransactionModel;
