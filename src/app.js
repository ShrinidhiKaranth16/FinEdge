const express = require("express");
const budgetRoutes = require("./routes/budgetRoutes");
const app = express();


app.use(express.json());

app.use("/budget", budgetRoutes);

module.exports = app;