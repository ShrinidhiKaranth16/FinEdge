const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const asyncWrapper = require("../middleware/asyncWrapper");
const AppError = require("../utils/AppError");

class UserController {
  registerUser = asyncWrapper(async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const created = await userService.createUser({ name, email, password });
      // don't return password back
      delete created.password;
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  });

  loginUser = asyncWrapper(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userService.findUserByEmail(email);
      if (!user) {
        throw new AppError("Invalid Email", 422);
      }
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new AppError("Invalid Password", 401);
      }
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      const token = jwt.sign(payload, process.env.PRIVATE_KEY, {
        expiresIn: "1h",
      });
      return res.status(200).send({ success: "true", token: token });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = new UserController();
