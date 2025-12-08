// __tests__/user.test.js
const request = require("supertest");
const fs = require("fs");
const path = require("path");

const app = require("../src/app");

// MAIN DATA FILE
const usersFile = path.join(__dirname, "..", "src", "data", "users.json");
// BACKUP FILE
const backupFile = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "users.backup.json"
);

let originalData = [];

// Load backup OR create one
beforeAll(async () => {
  try {
    originalData = JSON.parse(await fs.promises.readFile(usersFile, "utf-8"));
  } catch (err) {
    originalData = [];
  }

  // Ensure backup exists
  await fs.promises.writeFile(
    backupFile,
    JSON.stringify(originalData, null, 2)
  );

  // Reset test users.json to empty array
  await fs.promises.writeFile(usersFile, JSON.stringify([], null, 2));
});

// After the entire test suite → restore original data
afterAll(async () => {
  await fs.promises.writeFile(usersFile, JSON.stringify(originalData, null, 2));
});

// Before each test → clean fresh data
beforeEach(async () => {
  await fs.promises.writeFile(usersFile, JSON.stringify([], null, 2));
});

async function readUsers() {
  const raw = await fs.promises.readFile(usersFile, "utf8");
  return JSON.parse(raw || "[]");
}

describe("POST /users/register", () => {
  test("returns 400 when name is missing", async () => {
    const res = await request(app)
      .post("/users/register")
      .send({ email: "a@b.com", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/name/i);
  });

  test("returns 400 when email is invalid", async () => {
    const res = await request(app).post("/users/register").send({
      name: "Alice",
      email: "invalid-email",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/email/i);
  });

  test("returns 400 when password is too short", async () => {
    const res = await request(app).post("/users/register").send({
      name: "Bob",
      email: "bob@example.com",
      password: "123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/password/i);
  });

  test("creates user successfully and does not return password", async () => {
    const payload = {
      name: "Sanath",
      email: "sanath@example.com",
      password: "secret123",
    };

    const res = await request(app).post("/users/register").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("data");

    const user = res.body.data;

    expect(user).toHaveProperty("id");
    expect(user.name).toBe(payload.name);
    expect(user.email).toBe(payload.email);
    expect(user).not.toHaveProperty("password");

    const userList = await readUsers();
    expect(userList.length).toBe(1);
    expect(userList[0].password).not.toBe(payload.password);
  });

  test("returns 409 when email already exists", async () => {
    const payload = {
      name: "First",
      email: "dup@example.com",
      password: "secret123",
    };

    await request(app).post("/users/register").send(payload);

    const second = await request(app).post("/users/register").send({
      name: "Srinidhi",
      email: "dup@example.com",
      password: "newpass",
    });

    expect(second.status).toBe(409);
    expect(second.body.success).toBe(false);
    expect(second.body.message).toMatch(/already/i);
  });
});
