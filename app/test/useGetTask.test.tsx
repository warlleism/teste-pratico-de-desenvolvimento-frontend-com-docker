import { renderHook, act } from "@testing-library/react";
import { useTaskStore } from "../store/storeTask";
import { getAuthTokenFromCookie } from "../utils/getToken";
import { handleLogout } from "../utils/logOut";
import api from "../hooks/api";
import { useGetTasks } from "../hooks/tasks/useGetHook";

// Mock das dependências
jest.mock("../hooks/api");
jest.mock("../store/storeTask");
jest.mock("../utils/getToken");
jest.mock("../utils/logOut");

// Configuração dos mocks
const mockGetAuthTokenFromCookie = getAuthTokenFromCookie as jest.Mock;
const mockHandleLogout = handleLogout as jest.Mock;
const mockApiGet = api.get as jest.Mock;
const mockAddToAllTasks = jest.fn();
const mockAddTask = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (useTaskStore as unknown as jest.Mock).mockImplementation(() => ({
    tasks: [],
    addToAllTasks: mockAddToAllTasks,
    addTask: mockAddTask,
  }));
});

describe("useGetTasks", () => {
  const mockTasks: any = [
    {
      id: 1,
      title: "Tarefa 1",
      status: "pending",
      description: "",
      dueDate: "",
    },
    {
      id: 2,
      title: "Tarefa 2",
      status: "completed",
      description: "",
      dueDate: "",
    },
  ];

  it("deve buscar tarefas com sucesso", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiGet.mockResolvedValue({
      data: {
        data: {
          tasks: mockTasks,
        },
      },
    });

    const { result } = renderHook(() => useGetTasks());

    // Estado inicial
    expect(result.current.isLoading).toBe(true);

    // Aguarda todas as atualizações assíncronas
    await act(async () => {
      await Promise.resolve();
    });

    // Verificações após conclusão
    expect(mockApiGet).toHaveBeenCalledWith("/");
    expect(mockAddToAllTasks).toHaveBeenCalledWith(mockTasks);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("deve lidar com erro na API", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiGet.mockRejectedValue(new Error("Erro na API"));

    const { result } = renderHook(() => useGetTasks());

    // Estado inicial
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBe("Erro ao buscar reuniões");
    expect(result.current.isLoading).toBe(false);
    expect(mockAddToAllTasks).not.toHaveBeenCalled();
  });

  it("deve retornar o estado de loading corretamente", async () => {
    mockGetAuthTokenFromCookie.mockReturnValue("valid-token");
    mockApiGet.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () => resolve({ data: { data: { tasks: mockTasks } } }),
            100
          );
        })
    );

    const { result } = renderHook(() => useGetTasks());

    // Verificar estado inicial de loading
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    // Verificar que loading foi desativado após conclusão
    expect(result.current.isLoading).toBe(false);
  });

  it("deve retornar as tarefas do store", () => {
    const mockStoreTasks: any = [
      {
        id: 1,
        title: "Tarefa existente",
        status: "pending",
        description: "",
        dueDate: "",
      },
    ];

    (useTaskStore as unknown as jest.Mock).mockImplementation(() => ({
      tasks: mockStoreTasks,
      addToAllTasks: mockAddToAllTasks,
      addTask: mockAddTask,
    }));

    const { result } = renderHook(() => useGetTasks());

    // Verificar se retorna as tarefas do store
    expect(result.current.tasks).toEqual(mockStoreTasks);
  });
});
