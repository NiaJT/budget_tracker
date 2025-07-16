"use client";

import React from "react";
import {
  Plus,
  CreditCard,
  DollarSign,
  Clock,
  Target,
  PiggyBank,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Zap,
  Wallet,
  ArrowUp,
  ArrowDown,
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
  _id: string;
  title: string;
  currentBalance: number;
  savingPlan: number;
  currentSavings: number;
  period: string;
  description: string;
  userInfo: IUser;
}

interface ITransaction {
  _id: string;
  title: string;
  type: "income" | "expense";
  amount: number;
  category: {
    name: string;
    icon: string;
  };
  createdAt: string;
}

const HomePage = () => {
  // Fetch budget plan
  const {
    data: budgetData,
    isLoading: isBudgetLoading,
    error: budgetError,
  } = useQuery({
    queryKey: ["get-user-plan"],
    queryFn: async () => {
      const res = await axiosInstance.get("/budget/myplan");
      return res.data;
    },
  });

  // Fetch recent transactions (limited to 5 for better analytics)
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: async () => {
      const res = await axiosInstance.post("/transaction/list", { limit: 5 });
      return res.data;
    },
  });

  // Extract data from API responses
  const budgetPlan = budgetData?.budgetPlan?.[0];
  const transactions = transactionsData?.transactions || [];
  const userInfo = budgetPlan?.userInfo || {
    firstName: "",
    lastName: "",
    userId: "",
  };

  // Format date for transactions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Calculate financial metrics
  const calculateFinancialMetrics = () => {
    if (!transactions.length) return null;

    const incomeTransactions = transactions.filter(t => t.type === "income");
    const expenseTransactions = transactions.filter(t => t.type === "expense");

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const netFlow = totalIncome - totalExpenses;
    const savingsRate = budgetPlan 
      ? (budgetPlan.currentSavings / budgetPlan.savingPlan) * 100 
      : 0;

    // Find largest expense and income
    const largestExpense = expenseTransactions.length 
      ? expenseTransactions.reduce((max, t) => t.amount > max.amount ? t : max)
      : null;
    const largestIncome = incomeTransactions.length
      ? incomeTransactions.reduce((max, t) => t.amount > max.amount ? t : max)
      : null;

    return {
      totalIncome,
      totalExpenses,
      netFlow,
      savingsRate,
      largestExpense,
      largestIncome,
      expenseCount: expenseTransactions.length,
      incomeCount: incomeTransactions.length,
      latestTransaction: transactions[0],
      spendingRate: expenseTransactions.length / transactions.length * 100
    };
  };

  const financialMetrics = calculateFinancialMetrics();

  // Calculate savings progress
  const savingsProgress = budgetPlan
    ? (budgetPlan.currentSavings / budgetPlan.savingPlan) * 100
    : 0;

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-6 p-4 bg-gray-50">
      <div className="w-full md:w-[60%] bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6">
          {/* User Card */}
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
              {isTransactionsLoading ? (
                <div className="flex-1">Loading transactions...</div>
              ) : transactionsError ? (
                <div className="flex-1">Error loading transactions</div>
              ) : transactions.length > 0 ? (
                transactions.slice(0, 2).map((transaction: ITransaction) => {
                  const IconComponent = ({ className }: { className?: string }) => {
                    const LucideIcon = require("lucide-react")[transaction.category.icon];
                    return LucideIcon ? <LucideIcon className={className} /> : null;
                  };

                  return (
                    <div
                      key={transaction._id}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col items-center justify-center"
                    >
                      <div
                        className={`p-2 rounded-full mb-2 ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm text-gray-800 text-center">
                        {transaction.title}
                      </h3>
                      <div
                        className={`text-md font-semibold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "expense" ? "-" : "+"}$
                        {transaction.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {transaction.category.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1">No recent transactions</div>
              )}
            </div>
          </div>
        </div>

        {/* My Budget Plan */}
        <div className="flex flex-col mt-2">
          <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" /> My Budget Plan
          </h2>
          {isBudgetLoading ? (
            <div>Loading budget plan...</div>
          ) : budgetError ? (
            <div>Error loading budget plan</div>
          ) : budgetPlan ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <PiggyBank className="w-4 h-4" /> {budgetPlan.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {budgetPlan.description}
                    </p>
                  </div>
                  <div className="text-xs bg-black text-white px-2 py-1 rounded-full">
                    {budgetPlan.period}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{savingsProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{
                        width: `${savingsProgress}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Target</div>
                    <div className="font-bold">${budgetPlan.savingPlan}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Saved</div>
                    <div className="font-bold">
                      ${budgetPlan.currentSavings}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Current</div>
                    <div className="font-bold">
                      ${budgetPlan.currentBalance}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Remaining</div>
                    <div className="font-bold">
                      ${budgetPlan.savingPlan - budgetPlan.currentSavings}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 text-center border-t border-gray-100">
                <button className="text-black font-medium hover:text-gray-800 transition-colors text-sm flex items-center justify-center gap-1 mx-auto">
                  <span>Add New Budget Plan</span>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
              <p className="text-gray-500 mb-3">No budget plan created yet</p>
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Create Budget Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Section (Analytics - 40%) */}
      <div className="w-full md:w-[40%]">
        <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <BarChart2 className="w-5 h-5" /> Financial Insights
        </h2>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 space-y-6">
          {financialMetrics ? (
            <>
              {/* Net Cash Flow */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Net Cash Flow
                </h3>
                <div className={`p-4 rounded-lg border ${
                  financialMetrics.netFlow >= 0 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This period</span>
                    <div className={`flex items-center ${
                      financialMetrics.netFlow >= 0 
                        ? "text-green-600" 
                        : "text-red-600"
                    }`}>
                      {financialMetrics.netFlow >= 0 ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span className="font-bold ml-1">
                        ${Math.abs(financialMetrics.netFlow).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {financialMetrics.netFlow >= 0 
                      ? "You're saving more than spending" 
                      : "You're spending more than earning"}
                  </div>
                </div>
              </div>

              {/* Income vs Expenses */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> Income vs Expenses
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Income
                    </div>
                    <div className="font-bold text-lg mt-1">
                      ${financialMetrics.totalIncome.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {financialMetrics.incomeCount} transactions
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="text-xs text-red-600 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> Expenses
                    </div>
                    <div className="font-bold text-lg mt-1">
                      ${financialMetrics.totalExpenses.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {financialMetrics.expenseCount} transactions
                    </div>
                  </div>
                </div>
              </div>

              {/* Largest Transactions */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Key Transactions
                </h3>
                <div className="space-y-2">
                  {financialMetrics.largestIncome && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-green-100 rounded-full">
                          <ArrowUp className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs font-medium">Top Income</div>
                          <div className="text-xs text-gray-500">
                            {financialMetrics.largestIncome.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        +${financialMetrics.largestIncome.amount.toFixed(2)}
                      </div>
                    </div>
                  )}
                  {financialMetrics.largestExpense && (
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-red-100 rounded-full">
                          <ArrowDown className="w-3 h-3 text-red-600" />
                        </div>
                        <div>
                          <div className="text-xs font-medium">Top Expense</div>
                          <div className="text-xs text-gray-500">
                            {financialMetrics.largestExpense.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-red-600">
                        -${financialMetrics.largestExpense.amount.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Savings Progress */}
              {budgetPlan && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <PiggyBank className="w-4 h-4" /> Savings Progress
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Current: ${budgetPlan.currentSavings.toFixed(2)}</span>
                      <span>Target: ${budgetPlan.savingPlan.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full"
                        style={{ width: `${savingsProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {savingsProgress.toFixed(0)}% complete
                      </span>
                      <span className="text-xs text-gray-500">
                        ${(budgetPlan.savingPlan - budgetPlan.currentSavings).toFixed(2)} left
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {isTransactionsLoading ? "Loading financial insights..." : "No transaction data available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;