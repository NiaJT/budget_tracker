"use client";

import React from "react";
import { Formik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IError } from "@/interface/error.interface";
import Link from "next/link";
import {
  DollarSign,
  Loader2,
  ChevronRight,
  User,
  Lock,
  Mail,
  MapPin,
  Calendar,
  UserCircle, // Replaced VenusMars with UserCircle
} from "lucide-react";

interface IRegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob?: string;
  address: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationKey: ["budget-register"],
    mutationFn: async (values: IRegisterForm) => {
      return await axiosInstance.post("/user/register", values);
    },
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
      router.push("/login");
    },
    onError: (error: IError) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-teal-600 p-6 text-white">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <DollarSign className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">BudgetEase</h1>
          </div>
          <p className="text-center text-green-100 mt-2">
            Start your financial journey with us
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-1">
              Join thousands managing their finances better
            </p>
          </div>

          <Formik
            initialValues={{
              email: "",
              password: "",
              firstName: "",
              lastName: "",
              gender: "",
              dob: "",
              address: "",
            }}
            onSubmit={(values) => mutate(values)}
          >
            {({ handleSubmit, handleChange, values }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="firstName"
                      placeholder="First Name"
                      value={values.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <input
                      name="lastName"
                      placeholder="Last Name"
                      value={values.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      placeholder="Date of Birth"
                      value={values.dob}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="address"
                    placeholder="Address"
                    value={values.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                    isPending
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-teal-600 hover:to-teal-700"
                  } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md`}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Creating Account...
                    </span>
                  ) : (
                    "Register Now"
                  )}
                </button>
              </form>
            )}
          </Formik>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-teal-600 hover:text-teal-700 inline-flex items-center transition-colors"
            >
              Sign In <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
