const fs = require("fs").promises;
const path = require("path");

const usersFile = path.join(__dirname, "..", "data", "users.json");

async function readAll() {
  try {
    const raw = await fs.readFile(usersFile, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    // if not exists, create file with empty array
    if (err.code === "ENOENT") {
      await fs.mkdir(path.dirname(usersFile), { recursive: true });
      await fs.writeFile(usersFile, "[]", "utf8");
      return [];
    }
    throw err;
  }
}

async function writeAll(users) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf8");
}

function generateId() {
  // simple id generator, replace with uuid later if needed
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function findByEmail(email) {
  const users = await readAll();
  return (
    users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) ||
    null
  );
}

async function saveUser(user) {
  const users = await readAll();
  users.push(user);
  await writeAll(users);
}

module.exports = {
  readAll,
  writeAll,
  findByEmail,
  saveUser,
  generateId,
};
