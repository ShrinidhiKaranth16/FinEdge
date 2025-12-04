const { fetchBudgets, createBudget, updateBudget, deleteBudget } = require("../services/budgetService");

const fetchBudgetsController = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const budget = await fetchBudgets(id);

      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }

      return res.status(200).json(budget);
    }

    const budgets = await fetchBudgets();
    return res.status(200).json(budgets);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


const createBudgetController = async (req, res) => {
    const { monthlyLimit, savingsTarget } = req.body;

    const budget = await createBudget(monthlyLimit, savingsTarget);
    return res.status(201).json(budget);
};


const updateBudgetController = async (req, res) => {
    const { id } = req.params;
    const { monthlyLimit, savingsTarget } = req.body;

    const budget = await updateBudget(id, monthlyLimit, savingsTarget);
    if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
    }
    return res.status(200).json(budget);
};


const deleteBudgetController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteBudget(id);

    if (!deleted) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.status(200).json({
      message: "Budget deleted",
      deleted
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
    fetchBudgetsController,
    createBudgetController,
    updateBudgetController,
    deleteBudgetController  
};
