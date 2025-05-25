import { toast } from "react-toastify";
import { useState } from "react";
import api from "../api";
import { redirect } from "next/navigation";
import { getAuthTokenFromCookie } from "@/app/utils/getToken";
import { handleLogout } from "@/app/utils/logOut";

export const useDeleteTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = async (id: number) => {
    const authToken = getAuthTokenFromCookie();

    if (!authToken) {
      setError("Token de autenticação não encontrado");
      toast.error("Token de autenticação não encontrado");
      handleLogout(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/${id}`);

      if (response.data.status === 200) {
        toast.success("Tarefa excluida com sucesso");
        return redirect("/");
      } else {
        setError("Erro ao excluir tarefa");
        toast.error("Erro ao excluir tarefa");
      }
    } finally {
      setLoading(false);
    }
  };

  return { deleteTask, loading, error };
};
