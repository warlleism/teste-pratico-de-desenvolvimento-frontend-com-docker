import { renderHook, act, waitFor } from "@testing-library/react";
import { useCreateTask } from "../hooks/tasks/useCreateHook";
import { toast } from "react-toastify";
import { useTaskStore } from "../store/storeTask";
import { getAuthTokenFromCookie } from "../utils/getToken";
import { handleLogout } from "../utils/logOut";
import api from "../hooks/api";

// Mock todas as dependências externas
jest.mock("react-toastify");
jest.mock("../store/storeTask");
jest.mock("../utils/getToken");
jest.mock("../utils/logOut");
jest.mock("../hooks/api");

// Configuração dos mocks
const mockAddNewTasks = jest.fn();
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockGetAuthTokenFromCookie = getAuthTokenFromCookie as jest.Mock;
const mockHandleLogout = handleLogout as jest.Mock;
const mockApiPost = api.post as jest.Mock;

beforeEach(() => {
  // Resetar todos os mocks antes de cada teste
  jest.clearAllMocks();

  // Configurar implementação padrão do store
  (useTaskStore as unknown as jest.Mock).mockImplementation(() => ({
    addNewTasks: mockAddNewTasks,
  }));
});

describe("useCreateTask", () => {
  const mockTaskData: any = {
    id: 1,
    titulo: "Test Task",
    descricao: "Test Description",
    status: "pending",
    dataCriacao: new Date(),
    dataConclusao: null,
  };

  it("deve criar tarefa com sucesso", async () => {
    // Configurar mocks
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiPost.mockResolvedValue({
      data: {
        status: 201,
        data: mockTaskData,
      },
    });

    const { result } = renderHook(() => useCreateTask());

    // Executar a função assíncrona dentro de act
    await act(async () => {
      await result.current.createTask(mockTaskData);
    });

    // Verificações
    expect(mockApiPost).toHaveBeenCalledWith("/", mockTaskData);
    expect(mockToastSuccess).toHaveBeenCalledWith("Tarefa criada com sucesso");
    expect(mockAddNewTasks).toHaveBeenCalledWith(mockTaskData);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("deve lidar com erro de API", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiPost.mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.createTask(mockTaskData);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Erro ao criar tarefa");
    expect(mockToastError).toHaveBeenCalledWith("Erro ao criar tarefa");
  });

  it("deve lidar com a resposta de status não 201", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiPost.mockResolvedValue({
      data: {
        status: 400,
        message: "Bad Request",
      },
    });

    const { result } = renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.createTask(mockTaskData);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Erro ao criar tarefa");
    expect(mockToastError).toHaveBeenCalledWith("Erro ao criar tarefa");
  });

  it("deve lidar com token de autenticação ausente", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue(undefined); // ou null

    const { result } = renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.createTask(mockTaskData);
    });

    expect(mockHandleLogout).toHaveBeenCalledWith(true);
    expect(result.current.error).toBe("Token de autenticação não encontrado");
    expect(mockToastError).toHaveBeenCalledWith(
      "Token de autenticação não encontrado"
    ); // Atualize esta linha
  });
});
