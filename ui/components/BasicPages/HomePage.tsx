"use client";

import React from "react";
import {
  CreditCard,
  DollarSign,
  Wallet,
  Clock,
  Dumbbell,
  ShoppingBag,
  ShoppingCart,
  Shirt,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";

const userInfo = {
  name: "Niraj Thapa",
  id: "9879 2832 4567 1234",
  salary: "$5,250",
  paypal: "$1,875",
};

const recentTransactions = [
  {
    id: 1,
    name: "Gym Membership",
    amount: 45.0,
    date: "Today",
    type: "credit",
    icon: <Dumbbell className="w-5 h-5 text-black" />,
  },
  {
    id: 2,
    name: "Shopping",
    amount: 130.25,
    date: "Yesterday",
    type: "debit",
    icon: <ShoppingBag className="w-5 h-5 text-black" />,
  },
  {
    id: 3,
    name: "Grocery",
    amount: 80.99,
    date: "Jul 1",
    type: "debit",
    icon: <ShoppingCart className="w-5 h-5 text-black" />,
  },
  {
    id: 4,
    name: "Laundry",
    amount: 20.0,
    date: "Jun 28",
    type: "debit",
    icon: <Shirt className="w-5 h-5 text-black" />,
  },
];

const HomePage = () => {
  const { isPending, data } = useQuery({
    queryKey: ["get-user-plan"],
    queryFn: async () => {
      const res = await axiosInstance.get("/budget/myplan");
      toast.success(res?.data?.message);
      return res;
    },
  });
  console.log(data);
  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-6 p-4">
      <div className="w-full md:w-[60%] bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-6">
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
                    {userInfo.id}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg px-2 py-0.5 text-[10px] whitespace-nowrap">
                  ACTIVE
                </div>
              </div>
              <div className="mt-6">
                <div className="text-sm font-semibold">{userInfo.name}</div>
                <div className="flex justify-between items-end mt-2 text-[9px] opacity-70">
                  <div>REGISTERED SINCE 2023</div>
                  <div>SECURE ID</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="flex-1">
            <h1 className="flex gap-2 text-base font-semibold text-gray-800 mb-4 items-center">
              <Clock className="w-6 h-6 text-blue-600" />
              Upcoming Payments
            </h1>
            <div className="flex gap-4 flex-col sm:flex-row">
              {/* Salary Card */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="text-white bg-black p-2 rounded-full mb-2">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-sm text-gray-800 text-center">Salary</h3>
                <div className="text-md font-semibold">{userInfo.salary}</div>
              </div>

              {/* PayPal Card */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="text-white bg-black p-2 rounded-full mb-2">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="text-sm text-gray-800 text-center">PayPal</h3>
                <div className="text-md font-semibold">{userInfo.paypal}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="flex flex-col mt-2">
          <h2 className="text-base font-bold text-gray-800 mb-3">
            Recent Transactions
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-y-auto max-h-[200px]">
            {recentTransactions.slice(0, 3).map((transaction) => (
              <div
                key={transaction.id}
                className="p-3 border-b border-gray-100 last:border-b-0 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                {/* Left: Icon + Title */}
                <div className="flex items-center gap-3 w-1/3">
                  {React.cloneElement(transaction.icon, {
                    className: "w-5 h-5 text-black",
                  })}
                  <h3 className="text-sm font-medium text-gray-800">
                    {transaction.name}
                  </h3>
                </div>

                {/* Middle: Date */}
                <div className="text-sm text-gray-500 text-center w-1/3">
                  {transaction.date}
                </div>

                {/* Right: Amount */}
                <div className="flex justify-end text-sm font-semibold text-black w-1/3">
                  {transaction.type === "debit" && (
                    <span className="mr-1">-</span>
                  )}
                  <span>${transaction.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="p-3 text-center">
              <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors text-sm">
                View All Transactions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section (Analytics - 40%) */}
      <div className="w-full md:w-[40%]">
        <h2 className="text-base font-bold text-gray-800 mb-3">Analytics</h2>
        <div className="bg-white rounded-xl shadow-sm p-4">
          Content coming soon...
        </div>
      </div>
    </div>
  );
};

export default HomePage;
