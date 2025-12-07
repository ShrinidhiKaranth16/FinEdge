const path = require("path");
const fs = require("fs/promises");
const Budget = require("../models/budgetModel");

const budgetsPath = path.join(__dirname, "../data/budget.json");

const ensureBudgetFile = async () => {
  try {
    await fs.access(budgetsPath);
  } catch (err) {
    await fs.writeFile(budgetsPath, "[]");
  }
};

ensureBudgetFile();

const fetchBudgets = async (id = null) => {
  try {
    const data = await fs.readFile(budgetsPath, "utf-8");
    const budgets = JSON.parse(data);

    if (!id) return budgets;
    return budgets.find((b) => b.id === id) || null;
  } catch (err) {
    return id ? null : [];
  }
};

const createBudget = async (monthlyLimit, savingsTarget) => {
  let budgets = await fetchBudgets();

  const newBudget = new Budget(monthlyLimit, savingsTarget);

  budgets.push(newBudget);
  await saveBudgets(budgets);

  return newBudget;
};

const updateBudget = async (id, monthlyLimit, savingsTarget) => {
  let budgets = await fetchBudgets();
  const index = budgets.findIndex((b) => b.id === id);
  if (index === -1) return null;

  budgets[index].monthlyLimit = monthlyLimit;
  budgets[index].savingsTarget = savingsTarget;

  await saveBudgets(budgets);
  return budgets[index];
};

const deleteBudget = async (id) => {
  let budgets = await fetchBudgets();
  const index = budgets.findIndex((b) => b.id === id);

  if (index === -1) return null;

  const deleted = budgets.splice(index, 1)[0];
  await saveBudgets(budgets);

  return deleted;
};

const saveBudgets = async (budgets) => {
  await fs.writeFile(budgetsPath, JSON.stringify(budgets, null, 2));
};

module.exports = {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};
