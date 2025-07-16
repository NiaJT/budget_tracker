"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center w-[70%] px-4 py-2 mb-6 shadow-sm md:px-6">
      {/* Search Input */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 w-full max-w-md">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="outline-none border-none bg-transparent text-sm w-full text-gray-700"
        />
      </div>

      {/* Right Section: Create Button + Notification + Avatar */}
      <div className="flex items-center gap-4 ml-4">
        {/* Create Budget Button */}
        <button
          className="bg-black text-white p-2 rounded-2xl text-sm hover:cursor-pointer"
          onClick={() => {
            router.push("/budget/add");
          }}
        >
          Create Budget
        </button>

        {/* Notification Icon */}
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600 hover:text-black" />
          {/* Notification Dot */}
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
        </div>

        {/* Avatar */}
        <Avatar className="bg-black">
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback className="text-white">{}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
export default SearchBar;
