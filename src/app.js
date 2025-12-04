const express = require("express");
const app = express();

const transactionRoutes = require("./routes/transactionRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use("/api/v1/transactions", transactionRoutes);
app.use(errorHandler);

module.exports = app;
