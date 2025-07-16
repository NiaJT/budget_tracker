"use client";

import React from "react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import { budgetSchema } from "@/lib/validation/budget.schema";
import { IResponse } from "@/interface/response.interface";
import { IError } from "@/interface/error.interface";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BudgetFormValues {
  title: string;
  currentBalance: string;
  savingPlan: string;
  currentSavings: string;
  period: "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: Date;
  description: string;
}

const BudgetAddForm: React.FC = () => {
  const router = useRouter();

  const { mutate: addBudget, isLoading } = useMutation({
    mutationFn: (budgetData: any) =>
      axiosInstance.post("/budget/add", budgetData),
    onSuccess: (res: IResponse) => {
      toast.success(res.data.message);
      router.push("/");
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });

  const formik = useFormik<BudgetFormValues>({
    initialValues: {
      title: "",
      currentBalance: "",
      savingPlan: "",
      currentSavings: "",
      period: "monthly",
      startDate: new Date(),
      description: "",
    },
    validationSchema: budgetSchema,
    onSubmit: (values) => {
      console.log("Submitting budget data:", values);
      addBudget(values);
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-6 text-center text-gray-800">
        Add Budget
      </h2>

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm"
      >
        <FormField label="Title*" name="title" type="text" formik={formik} />
        <FormField
          label="Current Balance*"
          name="currentBalance"
          type="number"
          formik={formik}
        />
        <FormField
          label="Saving Plan*"
          name="savingPlan"
          type="number"
          formik={formik}
        />
        <FormField
          label="Current Savings*"
          name="currentSavings"
          type="number"
          formik={formik}
        />

        {/* Period dropdown */}
        <div className="flex flex-col">
          <label htmlFor="period" className="text-gray-700 mb-1">
            Period*
          </label>
          <select
            id="period"
            name="period"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.period}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          {formik.touched.period && formik.errors.period && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.period}
            </div>
          )}
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-gray-700 mb-1">
            Start Date*
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            onChange={(e) =>
              formik.setFieldValue("startDate", new Date(e.target.value))
            }
            onBlur={formik.handleBlur}
            value={formik.values.startDate.toISOString().split("T")[0]} // string format for input
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
          {formik.touched.startDate && formik.errors.startDate && (
            <div className="text-red-500 text-xs mt-1">
              {typeof formik.errors.startDate === "string"
                ? formik.errors.startDate
                : ""}
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
            {isLoading ? "Submitting..." : "Add Budget"}
          </button>
        </div>
      </form>
    </div>
  );
};

type FormFieldProps = {
  label: string;
  name: keyof BudgetFormValues;
  type: string;
  formik: ReturnType<typeof useFormik<BudgetFormValues>>;
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
      value={formik.values[name] as string}
      className="w-full border border-gray-300 rounded p-2 text-sm"
    />
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-500 text-xs mt-1">{formik.errors[name]}</div>
    )}
  </div>
);

export default BudgetAddForm;
