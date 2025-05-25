import { renderHook, act, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { useTaskStore } from "../store/storeTask";
import { getAuthTokenFromCookie } from "../utils/getToken";
import { handleLogout } from "../utils/logOut";
import api from "../hooks/api";
import { useUpdateTasks } from "../hooks/tasks/useUpdateHook";
import ITask from "../types/Task";

// Mock todas as dependências externas
jest.mock("react-toastify");
jest.mock("../store/storeTask");
jest.mock("../utils/getToken");
jest.mock("../utils/logOut");
jest.mock("../hooks/api");

// Configuração dos mocks
const mockUpdateTask = jest.fn();
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockGetAuthTokenFromCookie = getAuthTokenFromCookie as jest.Mock;
const mockHandleLogout = handleLogout as jest.Mock;
const mockApiPatch = api.patch as jest.Mock;

// Mock do console.error para evitar poluição nos logs de teste
jest.spyOn(console, "error").mockImplementation(() => {});

beforeEach(() => {
  // Resetar todos os mocks antes de cada teste
  jest.clearAllMocks();

  // Configurar implementação padrão do store
  (useTaskStore as unknown as jest.Mock).mockImplementation(() => ({
    updateTask: mockUpdateTask,
  }));
});

describe("useUpdateTasks", () => {
  const mockTaskData: any = {
    id: 1,
    titulo: "Updated Task",
    descricao: "Updated Description",
    status: "completed",
    dataCriacao: new Date(),
    dataConclusao: new Date(),
  };

  const taskId = 1;

  it("deve atualizar a tarefa com sucesso", async () => {
    // Configurar mocks
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiPatch.mockResolvedValue({
      data: {
        status: 200,
        data: mockTaskData,
      },
    });

    const { result } = renderHook(() => useUpdateTasks());

    // Executar a função assíncrona dentro de act
    await act(async () => {
      await result.current.updateTask(mockTaskData, taskId);
    });

    // Verificações
    expect(mockApiPatch).toHaveBeenCalledWith(`/${taskId}`, mockTaskData);
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Tarefa atualizada com sucesso"
    );
    expect(mockUpdateTask).toHaveBeenCalledWith(mockTaskData);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("deve lidar com token de autenticação ausente", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue(undefined);

    const { result } = renderHook(() => useUpdateTasks());

    await act(async () => {
      await result.current.updateTask(mockTaskData, taskId);
    });

    expect(mockHandleLogout).toHaveBeenCalledWith(true);
    expect(result.current.error).toBe("Token de autenticação não encontrado");
    expect(mockToastError).toHaveBeenCalledWith(
      "Token de autenticação não encontrado"
    );
    expect(result.current.loading).toBe(false);
  });

  it("deve lidar com erro de API", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiPatch.mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useUpdateTasks());

    await act(async () => {
      await result.current.updateTask(mockTaskData, taskId);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Erro ao atualizar tarefa");
    expect(mockToastError).toHaveBeenCalledWith("Erro ao atualizar tarefa");
  });

  it("deve lidar com resposta de status diferente de 200", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiPatch.mockResolvedValue({
      data: {
        status: 400,
        message: "Bad Request",
      },
    });

    const { result } = renderHook(() => useUpdateTasks());

    await act(async () => {
      await result.current.updateTask(mockTaskData, taskId);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Erro ao editar tarefa");
    expect(mockToastError).toHaveBeenCalledWith("Erro ao editar tarefa");
  });
});
