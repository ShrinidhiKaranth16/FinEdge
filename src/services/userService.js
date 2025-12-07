const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");

const SALT_ROUNDS = 10;

async function createUser({ name, email, password }) {
  // check unique email
  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = {
    id: userModel.generateId(),
    name,
    email,
    password: hashed,
    createdAt: new Date().toISOString(),
  };

  await userModel.saveUser(user);
  // return copy (safe)
  const { password: pw, ...safe } = user;
  return safe;
}

module.exports = {
  createUser,
};
