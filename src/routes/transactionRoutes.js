const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const { validateTransactionBody } = require("../middleware/validator");
const protect = require("../middleware/protect");

router.use(protect);

router.post("/", validateTransactionBody(true), transactionController.create);
router.get("/", transactionController.getAll);
router.get("/:id", transactionController.getById);
router.patch(
  "/:id",
  validateTransactionBody(false),
  transactionController.update
);
router.delete("/:id", transactionController.delete);

module.exports = router;
