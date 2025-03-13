import { useTasks } from "@/context/taskContext";
import React from "react";

function Filters() {
  const { priority, setPriority } = useTasks();

  const [activeIndex, setActiveIndex] = React.useState(0);

  const priorities = ["All", "Low", "Medium", "High"];

  return (
    <div className="relative py-3 px-3 flex items-center justify-between bg-white shadow-md border border-gray-300 rounded-lg font-serif overflow-hidden">
      <span
        className="absolute left-0 bg-blue-500 rounded-lg transition-all duration-300"
        style={{
          width: "calc(100% / 4 - 8px)",
          height: "calc(100% - 8px)",
          top: "50%",
          transform: `translate(calc(${activeIndex * 100}% + ${activeIndex * 8}px), -50%)`,
          transition: "transform 300ms cubic-bezier(.95,.03,1,1)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      ></span>
      {priorities.map((priority, index) => (
        <button
          key={index}
          className={`relative px-3 py-2 z-10 font-medium text-sm transition-all duration-300 ease-in-out rounded-md 
            ${activeIndex === index ? "text-white" : "text-gray-600 hover:text-blue-500"}`}
          onClick={() => {
            setActiveIndex(index);
            setPriority(priority.toLowerCase());
          }}
        >
          {priority}
        </button>
      ))}
    </div>
  );
}

export default Filters;
