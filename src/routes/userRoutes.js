const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateUser } = require("../middleware/validator");

router.post("/", validateUser, userController.registerUser);

module.exports = router;
