// __tests__/user.test.js
const request = require("supertest");
const fs = require("fs").promises;
const path = require("path");

const app = require("../src/app");

const usersFile = path.join(__dirname, "..", "src", "data", "users.json");

async function resetUsersFile() {
  await fs.mkdir(path.dirname(usersFile), { recursive: true });
  await fs.writeFile(usersFile, "[]", "utf8");
}

async function readUsers() {
  const raw = await fs.readFile(usersFile, "utf8");
  return JSON.parse(raw || "[]");
}

describe("POST /users", () => {
  beforeEach(async () => {
    await resetUsersFile();
  });

  test("returns 400 when name is missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "a@b.com", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false); // updated
    expect(res.body.message).toMatch(/Name/i);
  });

  test("returns 400 when email is invalid", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Alice", email: "invalid-email", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false); // updated
    expect(res.body.message).toMatch(/email/i);
  });

  test("returns 400 when password is too short", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Bob", email: "bob@example.com", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false); // updated
    expect(res.body.message).toMatch(/password/i);
  });

  test("creates user successfully and does not return password", async () => {
    const payload = {
      name: "Sanath",
      email: "sanath@example.com",
      password: "secret123",
    };

    const res = await request(app).post("/users").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true); // updated
    expect(res.body).toHaveProperty("data");

    const user = res.body.data;
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name", payload.name);
    expect(user).toHaveProperty("email", payload.email);
    expect(user).toHaveProperty("createdAt");
    expect(user).not.toHaveProperty("password");

    const users = await readUsers();
    expect(users.length).toBe(1);
    expect(users[0].email).toBe(payload.email);
    expect(users[0].password).toBeDefined();
    expect(users[0].password).not.toBe(payload.password);
  });

  test("returns 409 when email already exists", async () => {
    const payload = {
      name: "First",
      email: "dup@example.com",
      password: "secret123",
    };

    const first = await request(app).post("/users").send(payload);
    expect(first.status).toBe(201);

    const second = await request(app).post("/users").send({
      name: "Second",
      email: "dup@example.com",
      password: "another123",
    });

    expect(second.status).toBe(409);
    expect(second.body.success).toBe(false); // updated
    expect(second.body.message).toMatch(/already in use/i);
  });
});
