const express = require("express");
const AppError = require("./utils/AppError");
const app = express();

const transactionRoutes = require("./routes/transactionRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use("/transactions", transactionRoutes);
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});
app.use(errorHandler);

module.exports = app;
