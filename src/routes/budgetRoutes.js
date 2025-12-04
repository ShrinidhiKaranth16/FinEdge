const express = require("express");
const router = express.Router();
const { fetchBudgetsController, createBudgetController, updateBudgetController, deleteBudgetController } = require("../controllers/budgetController");
const validateBudget = require("../middleware/validator");


router.route("/")
    .get(fetchBudgetsController)
    .post(validateBudget, createBudgetController);

router.route("/:id")
    .get(fetchBudgetsController)
    .put(validateBudget, updateBudgetController)
    .delete(deleteBudgetController);

router.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl
  });
});

router.use((err, req, res, next) => {
  console.error("ERROR:", err.stack || err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message
  });
});


module.exports = router;
