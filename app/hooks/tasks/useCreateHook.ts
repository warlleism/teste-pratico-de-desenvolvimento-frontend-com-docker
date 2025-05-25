import { useTaskStore } from "@/app/store/storeTask";
import ITask from "@/app/types/Task";
import { getAuthTokenFromCookie } from "@/app/utils/getToken";
import { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { handleLogout } from "@/app/utils/logOut";

export const useCreateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNewTasks } = useTaskStore();

  const createTask = async (taskData: ITask) => {
    try {
      setError(null);
      setLoading(true);

      const authToken = getAuthTokenFromCookie();

      if (!authToken) {
        setError("Token de autenticação não encontrado");
        toast.error("Token de autenticação não encontrado"); // Adicione esta linha
        handleLogout(true);
        return;
      }

      const response = await api.post<ITask>("/", taskData);

      if (response.data.status === 201) {
        toast.success("Tarefa criada com sucesso");
        addNewTasks(response.data.data as never);
      } else {
        setError("Erro ao criar tarefa");
        toast.error("Erro ao criar tarefa");
      }
    } catch (error) {
      setError("Erro ao criar tarefa");
      toast.error("Erro ao criar tarefa");
    } finally {
      setLoading(false);
    }
  };

  return {
    createTask,
    loading,
    error,
  };
};
