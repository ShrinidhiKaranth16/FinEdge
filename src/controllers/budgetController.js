const {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require("../services/budgetService");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../middleware/asyncWrapper");

const fetchBudgetsController = asyncWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      const budget = await fetchBudgets(id);

      if (!budget) throw new AppError("Budget not found", 404);

      return res.status(200).json({ success: true, data: budget });
    }

    const budgets = await fetchBudgets();
    return res.status(200).json({ success: true, data: budgets });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

const createBudgetController = asyncWrapper(async (req, res) => {
  const { monthlyLimit, savingsTarget } = req.body;

  const budget = await createBudget(monthlyLimit, savingsTarget);
  return res.status(201).json({ success: true, data: budget });
});

const updateBudgetController = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { monthlyLimit, savingsTarget } = req.body;

  const budget = await updateBudget(id, monthlyLimit, savingsTarget);
  if (!budget) throw new AppError("Budget not found", 404);
  return res.status(200).json(budget);
});

const deleteBudgetController = asyncWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteBudget(id);

    if (!deleted) throw new AppError("Budget not found", 404);

    return res.status(200).json({
      message: "Budget deleted",
      deleted,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = {
  fetchBudgetsController,
  createBudgetController,
  updateBudgetController,
  deleteBudgetController,
};
