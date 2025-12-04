const validateBudget = (req, res, next) => {
  const { monthlyLimit, savingsTarget } = req.body;

  if (req.method === "POST") {
    if (monthlyLimit === undefined || savingsTarget === undefined) {
      return res.status(400).json({
        message: "monthlyLimit and savingsTarget are required"
      });
    }
  }

  if (monthlyLimit !== undefined && typeof monthlyLimit !== "number") {
    return res.status(400).json({ message: "monthlyLimit must be a number" });
  }

  if (savingsTarget !== undefined && typeof savingsTarget !== "number") {
    return res.status(400).json({ message: "savingsTarget must be a number" });
  }

  next();
};

module.exports = validateBudget;
