const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../src/app");
const transactionService = require("../src/services/transactionService");
const AppError = require("../src/utils/AppError");

const dataFilePath = path.join(__dirname, "../src/data/transactions.json");

let originalData = [];

beforeAll(async () => {
  try {
    originalData = JSON.parse(
      await fs.promises.readFile(dataFilePath, "utf-8")
    );
  } catch (err) {
    originalData = [];
  }
  await fs.promises.writeFile(dataFilePath, JSON.stringify([], null, 2));
});

afterAll(async () => {
  await fs.promises.writeFile(
    dataFilePath,
    JSON.stringify(originalData, null, 2)
  );
});

beforeEach(async () => {
  await fs.promises.writeFile(dataFilePath, JSON.stringify([], null, 2));
});

describe("Transaction Service", () => {
  test("should create a new transaction", async () => {
    const t = await transactionService.createTransaction({
      type: "income",
      category: "salary",
      amount: 5000,
    });

    expect(t).toHaveProperty("id");
    expect(t.type).toBe("income");
    expect(t.category).toBe("salary");
    expect(t.amount).toBe(5000);
  });

  test("should get all transactions", async () => {
    await transactionService.createTransaction({
      type: "income",
      category: "salary",
      amount: 1000,
    });

    const list = await transactionService.getAllTransactions();
    expect(list.length).toBe(1);
  });

  test("should get transaction by ID", async () => {
    const t = await transactionService.createTransaction({
      type: "expense",
      category: "food",
      amount: 200,
    });

    const found = await transactionService.getTransactionById(t.id);
    expect(found).toEqual(t);
  });

  test("should update a transaction", async () => {
    const t = await transactionService.createTransaction({
      type: "expense",
      category: "food",
      amount: 100,
    });

    const updated = await transactionService.updateTransaction(t.id, {
      amount: 250,
      category: "dining",
    });

    expect(updated.amount).toBe(250);
    expect(updated.category).toBe("dining");
    expect(updated).toHaveProperty("updatedAt");
  });

  test("should delete a transaction", async () => {
    const t = await transactionService.createTransaction({
      type: "income",
      category: "freelance",
      amount: 400,
    });

    const removed = await transactionService.deleteTransaction(t.id);
    expect(removed.id).toBe(t.id);

    const list = await transactionService.getAllTransactions();
    expect(list.length).toBe(0);
  });

  test("should throw error for invalid type", async () => {
    await expect(
      transactionService.createTransaction({
        type: "wrong",
        category: "salary",
        amount: 200,
      })
    ).rejects.toThrow(AppError);
  });

  test("should throw error for negative amount", async () => {
    await expect(
      transactionService.createTransaction({
        type: "income",
        category: "salary",
        amount: -20,
      })
    ).rejects.toThrow(AppError);
  });

  test("should throw 404 when updating non-existing", async () => {
    await expect(
      transactionService.updateTransaction("fake-id", { amount: 200 })
    ).rejects.toThrow(AppError);
  });

  test("should throw 404 when deleting non-existing", async () => {
    await expect(transactionService.deleteTransaction("fake")).rejects.toThrow(
      AppError
    );
  });
});

describe("Transaction Routes", () => {
  test("POST /transactions → should create a transaction", async () => {
    const res = await request(app).post("/transactions").send({
      type: "income",
      category: "salary",
      amount: 2000,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.type).toBe("income");
  });

  test("POST /transactions → should fail when type missing", async () => {
    const res = await request(app).post("/transactions").send({
      category: "food",
      amount: 100,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/type/i);
  });

  test("POST /transactions → invalid amount", async () => {
    const res = await request(app).post("/transactions").send({
      type: "expense",
      category: "food",
      amount: -5,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/greater than zero/i);
  });

  test("GET /transactions → should list all", async () => {
    await request(app)
      .post("/transactions")
      .send({ type: "income", category: "job", amount: 300 });

    const res = await request(app).get("/transactions");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  test("GET /transactions/:id → should return a transaction", async () => {
    const created = await request(app)
      .post("/transactions")
      .send({ type: "income", category: "work", amount: 500 });

    const id = created.body.data.id;

    const res = await request(app).get(`/transactions/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  test("GET /transactions/:id → should return 404 for missing id", async () => {
    const res = await request(app).get("/transactions/invalid-id");

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  test("PATCH /transactions/:id → should update", async () => {
    const created = await request(app)
      .post("/transactions")
      .send({ type: "expense", category: "food", amount: 100 });

    const id = created.body.data.id;

    const res = await request(app).patch(`/transactions/${id}`).send({
      category: "dining",
      amount: 150,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.amount).toBe(150);
    expect(res.body.data.category).toBe("dining");
  });

  test("PATCH /transactions/:id → invalid amount", async () => {
    const created = await request(app)
      .post("/transactions")
      .send({ type: "income", category: "salary", amount: 500 });

    const id = created.body.data.id;

    const res = await request(app).patch(`/transactions/${id}`).send({
      amount: -10,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/greater than zero/i);
  });

  test("DELETE /transactions/:id → should delete", async () => {
    const created = await request(app)
      .post("/transactions")
      .send({ type: "income", category: "freelance", amount: 400 });

    const id = created.body.data.id;

    const res = await request(app).delete(`/transactions/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test("DELETE /transactions/:id → 404 not found", async () => {
    const res = await request(app).delete("/transactions/nope");

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});
