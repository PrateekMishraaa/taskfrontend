"use client";
import IconCheck from "@/public/icons/IconCheck";
import IconDeleteAll from "@/public/icons/IconDeleteAll";
import IconFileCheck from "@/public/icons/IconFileCheck";
import IconGrid from "@/public/icons/IconGrid";
import IconStopwatch from "@/public/icons/IconStopwatch";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function MiniSidebar() {
  const pathname = usePathname();

  const getStrokeColor = (link: string) => {
    return pathname === link ? "#3aafae" : "#a1a1aa";
  };

  const navItems = [
    { icon: <IconGrid strokeColor={getStrokeColor("/")} />, title: "All", link: "/" },
    { icon: <IconFileCheck strokeColor={getStrokeColor("/completed")} />, title: "Completed", link: "/completed" },
    { icon: <IconCheck strokeColor={getStrokeColor("/pending")} />, title: "Pending", link: "/pending" },
    { icon: <IconStopwatch strokeColor={getStrokeColor("/overdue")} />, title: "Overdue", link: "/overdue" },
  ];

  return (
    <div className="w-20 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg rounded-xl">
      {/* Logo */}
      <div className="flex items-center justify-center py-4">
        {/* <Image src="./images(1).png" width={40} height={40} alt="logo" /> */}
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col items-center justify-between">
        <ul className="flex flex-col gap-8">
          {navItems.map((item, index) => (
            <li key={index} className="relative group">
              <Link href={item.link}>
                <div
                  className={`w-12 h-12 flex justify-center items-center rounded-lg transition duration-300 ${
                    pathname === item.link ? "bg-[#3aafae] shadow-lg shadow-teal-500/50" : "hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                </div>
              </Link>

              {/* Hover Tooltip */}
              <span className="absolute top-[50%] translate-y-[-50%] left-14 text-xs whitespace-nowrap bg-[#3aafae] text-white px-3 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.title}
              </span>
            </li>
          ))}
        </ul>

        {/* Delete Button */}
        <div className="mt-10 pb-4">
          <button className="w-14 h-14 flex justify-center items-center bg-red-600 hover:bg-red-500 rounded-full shadow-lg transition duration-300">
            <IconDeleteAll strokeColor="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiniSidebar;
