import * as yup from "yup";

export const transactionValidationSchema = yup.object({
  type: yup
    .string()
    .oneOf(["income", "expense"], "Type must be either 'income' or 'expense'")
    .required("Transaction type is required"),

  title: yup.string().trim().required("Title is required"),

  amount: yup
    .number()
    .typeError("Amount must be a number")
    .min(0, "Amount cannot be negative")
    .required("Amount is required"),
  date: yup.date().max(dayjs()).required(),
  category: yup
    .string()
    .oneOf(
      [
        // Income
        "Salary",
        "Business",
        "Investment",
        "Gift",
        "Freelance",
        "Rental Income",
        "Refunds",
        // Expense
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
      "Invalid category"
    )
    .required("Category is required"),
});
