"use client";

import React from "react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IResponse } from "@/interface/response.interface";
import { IError } from "@/interface/error.interface";

interface TransactionFormValues {
  type: "income" | "expense" | "";
  title: string;
  amount: string;
  category: string;
  description: string;
  date: Date;
}

// Categories by type
const categoriesByType = {
  income: [
    "Salary",
    "Business",
    "Investment",
    "Gift",
    "Freelance",
    "Rental Income",
    "Refunds",
  ],
  expense: [
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
};

// Validation schema
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
  category: yup.string().required("Category is required"),
  description: yup.string(),
});

const TransactionAddForm: React.FC = () => {
  const router = useRouter();
  const { mutate: addTransaction, isLoading } = useMutation({
    mutationFn: (transactionData: any) =>
      axiosInstance.post("/transaction/add", transactionData),
    onSuccess: (res: IResponse) => {
      toast.success(res.data.message);
      router.push("/");
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });

  const formik = useFormik<TransactionFormValues>({
    initialValues: {
      type: "",
      title: "",
      amount: "",
      category: "",
      description: "",
      date: new Date(),
    },
    validationSchema: transactionValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      addTransaction(values);
    },
  });

  // Current categories depending on selected type
  const currentCategories =
    formik.values.type && categoriesByType[formik.values.type]
      ? categoriesByType[formik.values.type]
      : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-6 text-center text-gray-800">
        Add Transaction
      </h2>

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
      >
        {/* Type */}
        <div className="flex flex-col">
          <label htmlFor="type" className="text-gray-700 mb-1">
            Transaction Type*
          </label>
          <select
            id="type"
            name="type"
            onChange={(e) => {
              formik.handleChange(e);
              // Clear category when type changes
              formik.setFieldValue("category", "");
            }}
            onBlur={formik.handleBlur}
            value={formik.values.type || ""}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {formik.touched.type && formik.errors.type && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.type}
            </div>
          )}
        </div>

        {/* Title */}
        <FormField label="Title*" name="title" type="text" formik={formik} />

        {/* Amount */}
        <FormField
          label="Amount*"
          name="amount"
          type="number"
          formik={formik}
        />

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category" className="text-gray-700 mb-1">
            Category*
          </label>
          <select
            id="category"
            name="category"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category || ""}
            disabled={!formik.values.type} // disable until type selected
            className="w-full border border-gray-300 rounded p-2 disabled:bg-gray-100"
          >
            <option value="" disabled>
              {formik.values.type
                ? "Select category"
                : "Select transaction type first"}
            </option>
            {currentCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.category}
            </div>
          )}
        </div>
        {/* Date */}
        <div className="flex flex-col">
          <label htmlFor="date" className="text-gray-700 mb-1">
            Date*
          </label>
          <input
            id="date"
            name="date"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.date}
            className="w-full border border-gray-300 rounded p-2"
          />
          {formik.touched.date && formik.errors.date && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.date}
            </div>
          )}
        </div>
        {/* Description (full width) */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="text-gray-700 mb-1 block">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description || ""}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.description}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Submitting..." : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

type FormFieldProps = {
  label: string;
  name: keyof TransactionFormValues;
  type: string;
  formik: ReturnType<typeof useFormik<TransactionFormValues>>;
};

const FormField: React.FC<FormFieldProps> = ({ label, name, type, formik }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-gray-700 mb-1 block">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name] || ""}
      className="w-full border border-gray-300 rounded p-2 text-sm"
    />
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-500 text-xs mt-1">{formik.errors[name]}</div>
    )}
  </div>
);

export default TransactionAddForm;
