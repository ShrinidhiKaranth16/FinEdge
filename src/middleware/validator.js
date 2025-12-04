const { z } = require("zod");

const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Transaction type is required",
  }),
  category: z.string().min(1, "Category is required"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0"),
});

module.exports = transactionSchema;
