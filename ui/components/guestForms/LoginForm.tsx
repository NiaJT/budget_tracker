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
  PieChart,
  Wallet,
  ShieldCheck,
  DollarSign,
  Facebook,
  Github,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface ILoginForm {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationKey: ["user-login"],
    mutationFn: async (values: ILoginForm) => {
      return await axiosInstance.post("/user/login", values);
    },
    onSuccess: (res) => {
      console.log(res);
      const accessToken = res?.data?.accessToken;
      const firstName = res?.data?.details?.firstName;
      window.localStorage.setItem("accessToken", accessToken);
      window.localStorage.setItem("firstName", firstName);
      toast.success(`Welcome back, ${firstName}!`);
      router.push("/");
    },
    onError: (error: IError) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  return (
    <div className="w-full lg:w-[700px] xl:w-[900px] h-[600px] flex rounded-xl">
      {/* Left Panel - Brand Showcase */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-teal-600 to-teal-700 text-white p-8 rounded-l-xl">
        <div className="mb-2">
          <h1 className="text-3xl font-bold">BudgetEase</h1>
          <p className="text-teal-100 text-sm mt-1">
            Financial Freedom Starts Here
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <PieChart className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Track Expenses</h3>
              <p className="text-teal-100 text-xs">Monitor spending habits</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Smart Budgeting</h3>
              <p className="text-teal-100 text-xs">Personalized budgets</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Financial Insights</h3>
              <p className="text-teal-100 text-xs">Improve financial health</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center mb-2">
            <div className="h-px bg-teal-400 flex-1"></div>
            <div className="px-2 text-teal-200 text-xs">
              Trusted by thousands
            </div>
            <div className="h-px bg-teal-400 flex-1"></div>
          </div>

          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="font-bold">500K+</div>
              <div className="text-teal-200">Users</div>
            </div>
            <div className="text-center">
              <div className="font-bold">$1B+</div>
              <div className="text-teal-200">Managed</div>
            </div>
            <div className="text-center">
              <div className="font-bold">4.8★</div>
              <div className="text-teal-200">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white rounded-r-xl">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="mx-auto bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <DollarSign className="h-5 w-5 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors: Partial<ILoginForm> = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.password) {
                errors.password = "Required";
              }
              return errors;
            }}
            onSubmit={(values) => mutate(values)}
          >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      errors.email && touched.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-teal-500"
                    } focus:outline-none focus:ring-1 focus:border-transparent`}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      errors.password && touched.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-teal-500"
                    } focus:outline-none focus:ring-1 focus:border-transparent`}
                  />
                  {errors.password && touched.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-3 w-3 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-teal-600 hover:text-teal-500"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full py-2 px-4 text-sm rounded-lg text-white font-medium ${
                    isPending
                      ? "bg-teal-400 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700"
                  } transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1`}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-1 h-3 w-3" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            )}
          </Formik>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-xs text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-between mt-3 gap-2">
              <button className="flex-1 flex items-center justify-center py-2 px-3 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Facebook className="h-3 w-3 text-gray-700 mr-1" />
                <span>Facebook</span>
              </button>

              <button className="flex-1 flex items-center justify-center py-2 px-3 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Github className="h-3 w-3 text-gray-700 mr-1" />
                <span>GitHub</span>
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-teal-600 hover:text-teal-500 inline-flex items-center"
            >
              Sign up <ChevronRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
