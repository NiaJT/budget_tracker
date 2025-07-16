"use client";

import React from "react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import { transactionValidationSchema } from "@/lib/validation/transaction.schema";

interface TransactionFormValues {
  type: "income" | "expense" | "";
  title: string;
  amount: string;
  category: string;
  description: string;
}

const TransactionAddForm: React.FC = () => {
  const {
    mutate: addTransaction,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (transactionData: any) =>
      axiosInstance.post("/transaction/add", transactionData),
  });

  const formik = useFormik<TransactionFormValues>({
    initialValues: {
      type: "",
      title: "",
      amount: "",
      category: "",
      description: "",
    },
    validationSchema: transactionValidationSchema,
    onSubmit: (values) => {
      const transactionData = {
        ...values,
        amount: +values.amount,
      };
      addTransaction(transactionData);
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-6 text-center text-gray-800">
        Add Transaction
      </h2>

      {isError && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded">
          {(error as any)?.response?.data?.message || (error as Error).message}
        </div>
      )}

      {isSuccess && (
        <div className="mb-3 p-2 bg-green-100 text-green-700 text-sm rounded">
          Transaction added successfully!
        </div>
      )}

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm"
      >
        {/* Type */}
        <div className="flex flex-col">
          <label htmlFor="type" className="text-gray-700 mb-1">
            Transaction Type*
          </label>
          <select
            id="type"
            name="type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.type}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          >
            <option value="">Select type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {formik.touched.type && formik.errors.type && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.type}
            </div>
          )}
        </div>

        <FormField label="Title*" name="title" type="text" formik={formik} />
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
            value={formik.values.category}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          >
            <option value="">Select category</option>

            {/* Income categories */}
            <optgroup label="Income">
              <option value="Salary">Salary</option>
              <option value="Business">Business</option>
              <option value="Investment">Investment</option>
              <option value="Gift">Gift</option>
              <option value="Freelance">Freelance</option>
              <option value="Rental Income">Rental Income</option>
              <option value="Refunds">Refunds</option>
            </optgroup>

            {/* Expense categories */}
            <optgroup label="Expense">
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Groceries">Groceries</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Insurance">Insurance</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Travel">Travel</option>
              <option value="Debt">Debt</option>
              <option value="Shopping">Shopping</option>
              <option value="Dining">Dining</option>
            </optgroup>
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.category}
            </div>
          )}
        </div>

        {/* Description */}
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
            value={formik.values.description}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
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
  <div>
    <label htmlFor={name} className="text-gray-700 mb-1 block">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name]}
      className="w-full border border-gray-300 rounded p-2 text-sm"
    />
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-500 text-xs mt-1">{formik.errors[name]}</div>
    )}
  </div>
);

export default TransactionAddForm;
