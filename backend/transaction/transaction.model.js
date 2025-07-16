import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: { type: Date, max: Date.now() },
  category: {
    type: String,
    enum: [
      // Income Categories
      "Salary",
      "Business",
      "Investment",
      "Gift",
      "Freelance",
      "Rental Income",
      "Refunds",
      // Expense Categories
      "Rent",
      "Utilities",
      "Groceries",
      "Transportation",
      "Entertainment",
      "Subscriptions",
      "Insurance",
      "Education",
      "Healthcare",
      "Travel",
      "Debt",
      "Shopping",
      "Dining",
    ],
    required: true,
  },
});

const TransactionTable = mongoose.model("Transaction", transactionSchema);
export default TransactionTable;
