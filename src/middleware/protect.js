const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel"); // your existing user model
const AppError = require("../utils/AppError");
const asyncWrapper = require("./asyncWrapper");

const protect = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Not authorized, no token", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) throw new AppError("Not authorized, no token", 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.PRIVATE_KEY);
  } catch (err) {
    throw new AppError("Not authorized, token failed", 401);
  }

  // Expect decoded to contain identifying info (email or id)
  let user;
  if (decoded.email) {
    user = await userModel.findByEmail(decoded.email);
  } else if (decoded.id) {
    user = await userModel.findById(decoded.id);
  } else {
    throw new AppError("Invalid token payload", 401);
  }

  if (!user) throw new AppError("User not found", 401);

  // attach minimal user info
  req.user = { id: user.id, name: user.name, email: user.email };
  next();
});

module.exports = protect;
