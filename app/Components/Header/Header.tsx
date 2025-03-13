"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import { github, moon, profile } from "@/utils/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function Header() {
  const { user } = useUserContext();
  const { openModalForAdd, activeTasks } = useTasks();
  

  const router = useRouter();

  const { name } = user;

  const userId = user._id;

  const handleClick = ()=>{
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <header className="px-6 my-4 w-full flex items-center justify-between bg-[#f9f9f9] ">
      <div>
        <h1 className="text-lg font-medium font-semibold font-serif">
          <span role="img" aria-label="wave">
            👋
          </span>
          {userId ? `Welcome, ${name}!` : "Welcome to TaskuMaster"}
        </h1>
        <p className="text-sm font-serif ml-8">
          {userId ? (
            <>
              You have{" "}
              <span className="font-bold text-[#3aafae] ">
                {activeTasks.length}
              </span>
              &nbsp;active tasks
            </>
          ) : (
            "Please login or register to view your tasks"
          )}
        </p>
      </div>
      <div className="h-[50px] flex items-center gap-[10.4rem]">
        <button
          className="px-8 py-3 bg-gray-800 text-white rounded-[50px]
          hover:bg-green-500 hover:text-white transition-all duration-200 ease-in-out"
          onClick={() => {
            if (userId) {
              openModalForAdd();
            } else {
              router.push("/login");
            }
          }}
        >
          {userId ? "Add a new Task" : "Login / Register"}
        </button>

        <div className="flex gap-4 items-center">
          <Link
            href=""
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-2xl border-2 border-[#E6E6E6] bg-black"
          >
            {github}
          </Link>
          <Link
            href=""
            passHref
            target="_blank"
            rel="noopener noreferrer"
           className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-2xl border-2 border-[#E6E6E6] bg-black"
          >
            {moon}
          </Link>
          <Link
            href=""
            passHref
            target="_blank"
            rel="noopener noreferrer"
           className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-2xl border-2 border-[#E6E6E6] bg-black"
          >
            {profile}
          </Link>
         
          <button 
  className="h-[60px] w-[60px] rounded-full text-sm font-semibold font-serif 
             flex items-center justify-center border-2 bg-black text-white 
             hover:bg-blue-600 transition-all duration-200 ease-in-out"
             onClick={()=>handleClick()}
>
  Logout
</button>

      </div>
        </div>
    </header>
  );
}

export default Header;
