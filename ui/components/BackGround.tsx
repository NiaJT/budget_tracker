import React from "react";
import SideBar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";

const BackGround = ({ children }) => {
  return (
    <div className="min-w-[92%] flex justify-start items-start p-4 rounded-3xl bg-[#f7fffb]">
      {/* Sidebar */}
      <SideBar />
      <div className="flex flex-col flex-grow">
        <div className="w-full flex justify-center items-center">
        <SearchBar /></div>
        <div className="bg-white rounded-3xl">{children}</div>
      </div>
    </div>
  );
};

export default BackGround;
