import * as Yup from "yup";

export const budgetSchema = Yup.object({
  title: Yup.string()
    .trim()
    .max(30, "Title must be at most 30 characters")
    .required("Title is required"),

  currentBalance: Yup.number()
    .typeError("Current balance must be a number")
    .min(0, "Current balance cannot be negative")
    .required("Current balance is required"),

  savingPlan: Yup.number()
    .typeError("Saving plan must be a number")
    .min(0, "Saving plan cannot be negative")
    .required("Saving plan is required"),

  currentSavings: Yup.number()
    .typeError("Current savings must be a number")
    .min(0, "Current savings cannot be negative")
    .required("Current savings is required"),

  period: Yup.string()
    .oneOf(["weekly", "monthly", "quarterly", "yearly"], "Invalid period")
    .required("Period is required"),

  startDate: Yup.date()
    .typeError("Start date must be a valid date")
    .required("Start date is required"),

  description: Yup.string().trim(),
});
