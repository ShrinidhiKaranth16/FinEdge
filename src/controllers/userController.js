const userService = require("../services/userService");
const AppError = require("../utils/AppError");

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const created = await userService.createUser({ name, email, password });
    // don't return password back
    delete created.password;
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};
