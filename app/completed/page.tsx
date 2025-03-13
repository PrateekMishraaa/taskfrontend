"use client";
import { useTasks } from "@/context/taskContext";
import useRedirect from "@/hooks/useUserRedirect";

import { Task } from "@/utils/types";
import { filteredTasks } from "@/utils/utilities";
import TaskItem from "../Components/TaskItem/TaskItem";
import Filters from "../Components/Filters/Filters";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/utils/animations";

export default function Home() {
  useRedirect("/login");

  const { openModalForAdd, priority, completedTasks, setPriority } = useTasks();
  const filtered = filteredTasks(completedTasks, priority);

  useEffect(() => {
    setPriority("all");
  }, []);

  return (
    <main className="m-6 h-full bg-gradient-to-br from-blue-50 to-gray-100 p-8 rounded-lg shadow-lg">  
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 font-serif">Completed Tasks</h1>
        <Filters />
      </div>

      <motion.div
        className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 pb-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {filtered.map((task: Task, i: number) => (
          <TaskItem key={i} task={task} />
        ))}
        
        <motion.button
          className="h-[16rem] w-full flex items-center justify-center rounded-lg text-lg font-medium text-gray-600 border-dashed border-2 border-gray-400
          hover:bg-blue-100 hover:border-blue-500 hover:text-blue-700 transition duration-300 ease-in-out font-serif shadow-md"
          onClick={openModalForAdd}
          variants={item}
        >
          + Add New Task
        </motion.button>
      </motion.div>
    </main>
  );
}
