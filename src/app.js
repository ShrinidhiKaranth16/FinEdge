const express = require("express");
const cors = require("cors");

const AppError = require("./utils/AppError");
const app = express();

const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());
app.use(logger);

// health route
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// mount routes
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/budget", budgetRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});
app.use(errorHandler);

module.exports = app;
