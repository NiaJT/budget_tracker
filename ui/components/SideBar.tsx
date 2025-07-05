"use client";
import React, { useState } from "react";
import { Home, Mail, User, Upload, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

// Define icons as an array of objects
const sideBarIcons: {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
}[] = [
  { name: "Home", icon: Home, link: "/" },
  { name: "Mail", icon: Mail, link: "/mail" },
  { name: "User", icon: User, link: "/user" },
  { name: "Upload", icon: Upload, link: "/upload" },
  { name: "Settings", icon: Settings, link: "/settings" },
];

const SideBar = () => {
  const [active, setActive] = useState("Home");
  const router = useRouter();

  return (
    <div className="flex flex-col min-w-[6%] h-[75vh] justify-between items-center py-6">
      {/* Top: Logo */}
      <div className="font-bold text-lg">LOGO</div>

      {/* Center: Icons */}
      <div className="flex-grow flex flex-col justify-center gap-6 items-center">
        {sideBarIcons.map((item) => (
          <div
            key={item.name}
            onClick={() => {
              router.replace(`${item.link}`);
              setActive(item.name);
            }}
            className={`p-2 rounded cursor-pointer transition-colors ${
              active === item.name
                ? "bg-black text-white"
                : "text-gray-700 hover:text-black"
            }`}
          >
            <item.icon className="w-6 h-6" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
