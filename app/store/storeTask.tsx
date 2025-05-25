import { create } from "zustand";
import { persist } from "zustand/middleware";
import ITask from "../types/Task";

interface TaskState {
  task: ITask | null;
  tasks: ITask[];
  updateTask: (updatedTask: ITask) => void;
  removeTask: () => void;
  addTask: (newTask: ITask) => void;
  addToAllTasks: (newTasks: ITask[]) => void;
  addNewTasks: (newTasks: ITask) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      task: null,
      tasks: [],
      updateTask: (updatedTask) =>
        set(() => ({
          task: updatedTask,
        })),
      removeTask: () => set(() => ({ task: null })),
      addTask: (newTask) => set(() => ({ task: newTask })),
      addToAllTasks: (newTasks) =>
        set(() => ({
          tasks: newTasks,
        })),
      addNewTasks: (newTasks) =>
        set((state) => ({
          tasks: [...state.tasks, newTasks],
        })),
    }),
    {
      name: "task-storage",
    }
  )
);
