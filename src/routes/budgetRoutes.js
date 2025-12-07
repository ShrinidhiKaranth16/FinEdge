const express = require("express");
const router = express.Router();
const {
  fetchBudgetsController,
  createBudgetController,
  updateBudgetController,
  deleteBudgetController,
} = require("../controllers/budgetController");
const { validateBudget } = require("../middleware/validator");

router
  .route("/")
  .get(fetchBudgetsController)
  .post(validateBudget, createBudgetController);

router
  .route("/:id")
  .get(fetchBudgetsController)
  .put(validateBudget, updateBudgetController)
  .delete(deleteBudgetController);

module.exports = router;
