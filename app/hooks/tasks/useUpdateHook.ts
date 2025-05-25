import { getAuthTokenFromCookie } from "@/app/utils/getToken";
import { useTaskStore } from "@/app/store/storeTask";
import { handleLogout } from "@/app/utils/logOut";
import { toast } from "react-toastify";
import ITask from "@/app/types/Task";
import { useState } from "react";
import api from "../api";

export const useUpdateTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateTask: update } = useTaskStore();

  const updateTask = async (taskData: ITask, taskId: number) => {
    try {
      setLoading(true);
      setError(null);

      const authToken = getAuthTokenFromCookie();

      if (!authToken) {
        setError("Token de autenticação não encontrado");
        toast.error("Token de autenticação não encontrado"); // Adicione esta linha
        handleLogout(true);
        return;
      }

      const response = await api.patch(`/${taskId}`, taskData);

      if (response.data.status === 200) {
        toast.success("Tarefa atualizada com sucesso");
        update(response.data.data as any);
      } else {
        setError("Erro ao editar tarefa");
        toast.error("Erro ao editar tarefa");
      }
    } catch (err) {
      setError("Erro ao atualizar tarefa");
      toast.error("Erro ao atualizar tarefa");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateTask, loading, error };
};
