"use client";
import api from "../api";
import { useEffect, useState } from "react";
import { getAuthTokenFromCookie } from "@/app/utils/getToken";
import { handleLogout } from "@/app/utils/logOut";
import { useTaskStore } from "@/app/store/storeTask";
import ApiResponse from "@/app/types/Task";

export const useGetTasks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToAllTasks, tasks, addTask } = useTaskStore();

  useEffect(() => {
    const getTasks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const authToken = getAuthTokenFromCookie();

        if (!authToken) {
          setError("Token de autenticação não encontrado");
          handleLogout(true);
          return;
        }

        const response = await api.get<ApiResponse>("/");
        addToAllTasks(response.data.data.tasks as any);
      } catch (err) {
        setError("Erro ao buscar reuniões");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    getTasks();
  }, []);

  return { tasks, isLoading, error, addTask };
};
