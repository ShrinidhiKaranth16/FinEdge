const fs = require("fs");
const path = require("path");
const transactionService = require("../src/services/transactionService");

const dataFilePath = path.join(__dirname, "../src/data/transactions.json");

const resetDataFile = async () => {
  await fs.promises.writeFile(dataFilePath, JSON.stringify([], null, 2));
};

beforeEach(async () => {
  await resetDataFile();
});

describe("Transaction Service", () => {
  test("should create a new transaction", async () => {
    const transaction = await transactionService.createTransaction({
      type: "income",
      category: "salary",
      amount: 5000,
    });

    expect(transaction).toHaveProperty("id");
    expect(transaction.type).toBe("income");
    expect(transaction.category).toBe("salary");
    expect(transaction.amount).toBe(5000);
    expect(transaction).toHaveProperty("date");
  });

  test("should get all transactions", async () => {
    await transactionService.createTransaction({
      type: "income",
      category: "salary",
      amount: 5000,
    });

    const allTransactions = await transactionService.getAllTransactions();
    expect(allTransactions.length).toBe(1);
    expect(allTransactions[0].category).toBe("salary");
  });

  test("should get transaction by ID", async () => {
    const t = await transactionService.createTransaction({
      type: "expense",
      category: "food",
      amount: 100,
    });

    const fetched = await transactionService.getTransactionById(t.id);
    expect(fetched).toEqual(t);
  });

  test("should update a transaction", async () => {
    const t = await transactionService.createTransaction({
      type: "expense",
      category: "food",
      amount: 100,
    });

    const updated = await transactionService.updateTransaction(t.id, {
      amount: 150,
      category: "dining",
    });

    expect(updated.amount).toBe(150);
    expect(updated.category).toBe("dining");
  });

  test("should delete a transaction", async () => {
    const t = await transactionService.createTransaction({
      type: "income",
      category: "freelance",
      amount: 200,
    });

    const deleted = await transactionService.deleteTransaction(t.id);
    expect(deleted.id).toBe(t.id);

    const allTransactions = await transactionService.getAllTransactions();
    expect(allTransactions.length).toBe(0);
  });

  test("should throw validation error for invalid type", async () => {
    await expect(
      transactionService.createTransaction({
        type: "wrong",
        category: "salary",
        amount: 1000,
      })
    ).rejects.toThrow();
  });

  test("should throw validation error for negative amount", async () => {
    await expect(
      transactionService.createTransaction({
        type: "income",
        category: "salary",
        amount: -500,
      })
    ).rejects.toThrow();
  });
});
