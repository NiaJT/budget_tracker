"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  CreditCard,
  DollarSign,
  Wallet,
  Clock,
  Dumbbell,
  ShoppingBag,
  ShoppingCart,
  Shirt,
  Target,
  PiggyBank,
  Calendar,
  BarChart2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";

interface IUser {
  firstName: string;
  lastName: string;
  userId: string;
}

interface IBudgetPlan {
  title: string;
  targetAmount: number;
  savedAmount: number;
  currentBalance: number;
  period: string;
  description: string;
}

const transactions = [
  {
    id: 2,
    name: "Shopping",
    amount: 130.25,
    date: "Yesterday",
    type: "debit",
    icon: <ShoppingBag className="w-4 h-4 text-black" />,
    category: "Shopping",
  },
  {
    id: 3,
    name: "Salary Deposit",
    amount: 2500.0,
    date: "Jul 1",
    type: "credit",
    icon: <DollarSign className="w-4 h-4 text-black" />,
    category: "Income",
  },
];

const HomePage = () => {
  const [userInfo, setUserInfo] = useState<IUser>({
    firstName: "Niraj",
    lastName: "Thapa",
    userId: "123444",
  });

  const [budgetPlans, setBudgetPlans] = useState<IBudgetPlan[]>([
    {
      title: "Emergency Fund",
      targetAmount: 10000,
      savedAmount: 6500,
      currentBalance: 6500,
      period: "12 months",
      description: "Saving for unexpected expenses",
    },
  ]);

  const { isPending, data } = useQuery({
    queryKey: ["get-user-plan"],
    queryFn: async () => {
      const res = await axiosInstance.get("/budget/myplan");
      toast.success(res?.data?.message);
      setBudgetPlans(res.data.budgetPlan);
      setUserInfo(res.data.budgetPlan[0].userInfo);
      return res;
    },
  });
  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-6 p-4 bg-gray-50">
      <div className="w-full md:w-[60%] bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-[300px] shrink-0 md:sticky top-4 h-fit">
            <h1 className="text-base font-semibold text-gray-800 mb-3">
              Dashboard
            </h1>
            <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-3 text-white font-sans flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] opacity-75 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> USER ID CARD
                  </div>
                  <div className="text-sm tracking-widest font-mono mt-2">
                    {userInfo.userId}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg px-2 py-0.5 text-[10px] whitespace-nowrap">
                  ACTIVE
                </div>
              </div>
              <div className="mt-6">
                <div className="text-sm font-semibold">
                  {userInfo.firstName} {userInfo.lastName}
                </div>
                <div className="flex justify-between items-end mt-2 text-[9px] opacity-70">
                  <div>SECURE ID</div>
                  <div>By BudgetEase </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="flex-1">
            <h1 className="flex gap-2 text-base font-semibold text-gray-800 mb-4 items-center">
              <Clock className="w-6 h-6 text-black" />
              Recent Transactions
            </h1>
            <div className="flex gap-4 flex-col sm:flex-row">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col items-center justify-center"
                >
                  <div
                    className={`p-2 rounded-full mb-2 ${
                      transaction.type === "credit"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.icon}
                  </div>
                  <h3 className="text-sm text-gray-800 text-center">
                    {transaction.name}
                  </h3>
                  <div
                    className={`text-md font-semibold ${
                      transaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "debit" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {transaction.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Budget Plan */}
        <div className="flex flex-col mt-2">
          <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" /> My Budget Plans
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {budgetPlans.map((plan, index) => (
              <div
                key={index}
                className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <PiggyBank className="w-4 h-4" /> {plan.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <div className="text-xs bg-black text-white px-2 py-1 rounded-full">
                    {plan.period}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>
                      {((plan.savedAmount / plan.targetAmount) * 100).toFixed(
                        0
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{
                        width: `${
                          (plan.savedAmount / plan.targetAmount) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Target</div>
                    <div className="font-bold">${plan.targetAmount}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Saved</div>
                    <div className="font-bold">${plan.savedAmount}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Current</div>
                    <div className="font-bold">${plan.currentBalance}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Remaining</div>
                    <div className="font-bold">
                      ${plan.targetAmount - plan.savedAmount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-3 text-center border-t border-gray-100">
              <button className="text-black font-medium hover:text-gray-800 transition-colors text-sm flex items-center justify-center gap-1 mx-auto">
                <span>Add New Budget Plan</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section (Analytics - 40%) */}
      <div className="w-full md:w-[40%]">
        <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <BarChart2 className="w-5 h-5" /> Analytics Overview
        </h2>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Total Income
              </div>
              <div className="font-bold text-lg mt-1">$3,250.00</div>
              <div className="text-xs text-green-600 mt-1">
                +12% from last month
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <ShoppingCart className="w-3 h-3" /> Total Expenses
              </div>
              <div className="font-bold text-lg mt-1">$1,480.50</div>
              <div className="text-xs text-red-600 mt-1">
                +5% from last month
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Monthly Budget
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Spent: $1,480 (59%)</span>
                <span>Remaining: $1,020</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: "59%" }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                $2,500 monthly budget
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Expense Categories
            </h3>
            <div className="space-y-2">
              {[
                { category: "Food & Dining", amount: 420, percentage: 28 },
                { category: "Transportation", amount: 320, percentage: 22 },
                { category: "Entertainment", amount: 280, percentage: 19 },
                { category: "Utilities", amount: 210, percentage: 14 },
                { category: "Others", amount: 250, percentage: 17 },
              ].map((item, index) => (
                <div key={index} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{item.category}</span>
                    <span className="text-gray-900 font-medium">
                      ${item.amount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-black h-1.5 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
