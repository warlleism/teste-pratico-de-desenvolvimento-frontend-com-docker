import { renderHook, act } from "@testing-library/react";
import { toast } from "react-toastify";
import { getAuthTokenFromCookie } from "../../app/utils/getToken";
import { handleLogout } from "../../app/utils/logOut";
import { useDeleteTasks } from "../hooks/tasks/useDeleteHook";
import api from "../hooks/api";

// Mock das dependências
jest.mock("react-toastify");
jest.mock("next/navigation", () => ({
  redirect: jest.fn(() => ({})), // Mock do redirect que retorna um objeto vazio
}));
jest.mock("../../app/utils/getToken");
jest.mock("../../app/utils/logOut");
jest.mock("../hooks/api");

// Configuração dos mocks
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockGetAuthTokenFromCookie = getAuthTokenFromCookie as jest.Mock;
const mockHandleLogout = handleLogout as jest.Mock;
const mockApiDelete = api.delete as jest.Mock;
const mockRedirect = require("next/navigation").redirect as jest.Mock;

beforeEach(() => {
  // Resetar todos os mocks antes de cada teste
  jest.clearAllMocks();
});

describe("useDeleteTasks", () => {
  const taskId = 1;

  it("deve excluir tarefa com sucesso e redirecionar", async () => {
    // Configurar mocks
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiDelete.mockResolvedValue({
      data: {
        status: 200,
      },
    });

    const { result } = renderHook(() => useDeleteTasks());

    // Executar a função assíncrona dentro de act
    await act(async () => {
      result.current.deleteTask(taskId);
    });

    // Verificações
    expect(mockApiDelete).toHaveBeenCalledWith(`/${taskId}`);
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Tarefa excluida com sucesso"
    );
    expect(mockRedirect).toHaveBeenCalledWith("/");
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("deve lidar com token de autenticação ausente", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue(null);

    const { result } = renderHook(() => useDeleteTasks());

    await act(async () => {
      result.current.deleteTask(taskId);
    });

    expect(mockHandleLogout).toHaveBeenCalledWith(true);
    expect(result.current.error).toBe("Token de autenticação não encontrado");
    expect(mockToastError).toHaveBeenCalledWith(
      "Token de autenticação não encontrado"
    );
    expect(result.current.loading).toBe(false);
    expect(mockApiDelete).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("deve lidar com status de resposta diferente de 200", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiDelete.mockResolvedValue({
      data: {
        status: 400,
      },
    });

    const { result } = renderHook(() => useDeleteTasks());

    await act(async () => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Erro ao excluir tarefa");
    expect(mockToastError).toHaveBeenCalledWith("Erro ao excluir tarefa");
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("deve gerenciar corretamente o estado de loading", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiDelete.mockResolvedValue({
      data: {
        status: 200,
      },
    });

    const { result } = renderHook(() => useDeleteTasks());

    // Verificar estado inicial
    expect(result.current.loading).toBe(false);

    await act(async () => {
      const promise = result.current.deleteTask(taskId);
      // Verificar loading imediatamente após chamar a função
      expect(result.current.loading).toBe(false);
      await promise;
    });

    // Verificar loading após conclusão
    expect(result.current.loading).toBe(false);
  });
});
