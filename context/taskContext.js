import axios from "axios";
import React, { createContext, useEffect } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

// Update the correct server URL
const serverUrl = "http://localhost:5000/api/v1";

export const TasksProvider = ({ children }) => {
  const userId = useUserContext()?.user?._id; // Ensure userId is defined

  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [task, setTask] = React.useState({});

  const [isEditing, setIsEditing] = React.useState(false);
  const [priority, setPriority] = React.useState("all");
  const [activeTask, setActiveTask] = React.useState(null);
  const [modalMode, setModalMode] = React.useState("");
  const [profileModal, setProfileModal] = React.useState(false);

  // Open modal for adding a task
  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({});
  };

  // Open modal for editing a task
  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask({});
  };

  // Fetch all tasks
  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/tasks`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error getting tasks", error);
    }
    setLoading(false);
  };

  // Fetch a single task
  const getTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/task/${taskId}`);
      setTask(response.data);
    } catch (error) {
      console.error("Error getting task", error);
    }
    setLoading(false);
  };

  // ✅ Create a new task
  const createTask = async (taskData) => {
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }
  
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/task/create`, {
        ...taskData,
        userId, // ✅ Correct field name
      });
  
      console.log("Task created", res.data);
      setTasks([...tasks, res.data]); // Update the task list
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error creating task", error);
      toast.error(error.response?.data?.message || "Failed to create task");
    }
    setLoading(false);
  };
  

  // ✅ Update an existing task
  const updateTask = async (taskData) => {
    setLoading(true);
    try {
      const res = await axios.patch(`${serverUrl}/task/${taskData._id}`, taskData);

      // Update the task in the tasks array
      const updatedTasks = tasks.map((tsk) => (tsk._id === res.data._id ? res.data : tsk));

      toast.success("Task updated successfully");
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task", error);
      toast.error("Failed to update task");
    }
    setLoading(false);
  };

  // ✅ Delete a task
  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/task/${taskId}`);

      // Remove the task from the tasks array
      const newTasks = tasks.filter((tsk) => tsk._id !== taskId);
      setTasks(newTasks);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task", error);
      toast.error("Failed to delete task");
    }
    setLoading(false);
  };

  // Handle input changes
  const handleInput = (name) => (e) => {
    setTask({ ...task, [name]: e.target.value });
  };

  // Filter completed and pending tasks
  const completedTasks = tasks.filter((task) => task.completed);
  const activeTasks = tasks.filter((task) => !task.completed);

  // Fetch tasks when component mounts
  useEffect(() => {
    if (userId) {
      getTasks();
    }
  }, [userId]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        activeTasks,
        completedTasks,
        profileModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  return React.useContext(TasksContext);
};
