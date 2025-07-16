import * as Yup from "yup";

export const transactionValidationSchema = Yup.object({
  type: Yup.string()
    .oneOf(["income", "expense"], "Type must be either 'income' or 'expense'")
    .required("Transaction type is required"),

  title: Yup.string().trim().required("Title is required"),

  amount: Yup.number()
    .typeError("Amount must be a number")
    .min(0, "Amount cannot be negative")
    .required("Amount is required"),

  category: Yup.string().required("Category is required"),

  description: Yup.string().trim(),

  date: Yup.date()
    .typeError("Invalid date format")
    .required("Date is required"),
});
