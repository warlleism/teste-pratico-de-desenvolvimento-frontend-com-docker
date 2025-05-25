"use client";

import MainContainerOverflow from "../../styles/container/container";
import TaskStatus from "@/app/components/TaskStatus/meetingStatus";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { useGetTasks } from "@/app/hooks/tasks/useGetHook";
import { IoIosClose, IoIosSearch } from "react-icons/io";
import ModalTaskCreate from "./component/modalCreate";
import FormControl from "@mui/material/FormControl";
import LoadingSkeleton from "./component/skeleton";
import InputLabel from "@mui/material/InputLabel";
import formatDate from "../../utils/formateDate";
import { redirect } from "next/navigation";
import Select from "@mui/material/Select";
import { FaCircle } from "react-icons/fa";
import { useRef, useState } from "react";
import ITask from "@/app/types/Task";
import "./style.scss";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { tasks, addTask, isLoading } = useGetTasks();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [filteredRegister, setFilteredRegister] = useState<ITask[]>([]);
  const [selectedKeys, setSelectedKeys] = useState({
    status: "",
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedKeys((prevSelectedKeys) => {
      const updatedKeys = {
        ...prevSelectedKeys,
        [filterType]: value,
      };

      const filtered = tasks.filter((task: any) => {
        const { status } = updatedKeys;

        if (status !== "") {
          const statusList = status.split(",").map((item) => item.trim());
          if (!statusList.includes(task.status)) return false;
        }

        return true;
      });

      setFilteredRegister(filtered);
      return updatedKeys;
    });
  };

  const handleClearFilter = (filterType?: string) => {
    if (filterType) {
      setSelectedKeys((prevSelectedKeys) => ({
        ...prevSelectedKeys,
        [filterType]: "",
      }));
      handleFilterChange(filterType, "");
    } else {
      if (inputRef.current) inputRef.current.value = "";

      setSelectedKeys({ status: "" });
      setFilteredRegister([]);
    }
  };

  const handleSearch = (value: string) => {
    if (value === "") {
      setFilteredRegister([]);
      return;
    }

    let searchValue = "";
    if (inputRef.current) {
      searchValue = value.toLowerCase();
      const filtered = tasks.filter(
        (task: any) =>
          task?.titulo?.toLowerCase()?.includes(searchValue) ||
          task?.descricao?.toLowerCase()?.includes(searchValue)
      );
      setFilteredRegister(filtered);
    }
  };

  const handleSetRegister = (data: ITask) => {
    addTask(data);
    redirect("/detail-register");
  };

  const registers: ITask[] =
    filteredRegister.length > 0 ? filteredRegister : tasks;

  return (
    <Box className="w-full h-[100vh] flex flex-col items-center justify-center">
      <ModalTaskCreate
        isOpenCreate={isOpenCreate}
        onOpenCreateChange={() => setIsOpenCreate(!isOpenCreate)}
      />
      <MainContainerOverflow>
        <Box className="main-task-register-content">
          <Box className="flex flex-row justify-between items-center">
            <Box className="text-[1.6rem] text-[#232323] font-bold">
              Tarefas
            </Box>
            <Button
              variant="contained"
              type="submit"
              className="default-button bg-primary text-white py-2 rounded-2xl mt-4"
              onClick={() => setIsOpenCreate(!isOpenCreate)}
            >
              Criar nova tarefa
            </Button>
          </Box>
          <Box className="task-register-result-header-filter">
            <Box className="task-register-result-header-filter-search">
              <TextField
                inputRef={inputRef}
                label="Pesquisar..."
                variant="outlined"
                onChange={(e) => handleSearch(e.target.value)}
                slotProps={{
                  input: {
                    style: { color: "#000" },
                  },
                  inputLabel: {
                    sx: {
                      color: "#000",
                    },
                  },
                }}
              />
            </Box>
            <FormControl className="w-[200px]">
              <InputLabel
                sx={{
                  color: "#000",
                }}
                id="demo-simple-select-label"
              >
                Status
              </InputLabel>
              <Select
                sx={{
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                  "& .MuiInputBase-input": {
                    color: "#000",
                  },
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedKeys.status || ""}
                label="Status"
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <MenuItem value="">
                  <em>Nenhum status</em>
                </MenuItem>
                <MenuItem value="pendente">Pendente</MenuItem>
                <MenuItem value="em andamento">Em andamento</MenuItem>
                <MenuItem value="concluído">Concluído</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box className="flex flex-col gap-4">
            <Box
              className={`w-full h-[2px] rounded-full
                 bg-[#7A7E7F]
                }`}
            />
            <h3
              className={`
                 text-[#232323] 
                 text-[#414141] font-bold`}
            >
              {registers.length}{" "}
              {registers.length === 1 || filteredRegister.length === 1
                ? "RESULTADO ENCONTRADO"
                : "RESULTADOS ENCONTRADOS"}
            </h3>
          </Box>
          <Box className="task-register-result">
            {Object.values(selectedKeys).some((value) => value !== "") && (
              <Box className="flex flex-wrap gap-2 mb-4">
                {selectedKeys.status && (
                  <span className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm">
                    {selectedKeys.status}
                    <IoIosClose
                      size={20}
                      className="ml-1 cursor-pointer"
                      onClick={() => handleClearFilter("status")}
                    />
                  </span>
                )}
                <span
                  onClick={() => handleClearFilter()}
                  className="flex flex-row items-center cursor-pointer bg-[#dbdbdb] rounded-full px-3 py-1 text-sm"
                >
                  Limpar Filtros <IoIosClose size={20} />
                </span>
              </Box>
            )}
            {isLoading ? (
              <Box className="w-full flex flex-col gap-4">
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </Box>
            ) : !isLoading &&
              tasks.length > 0 &&
              filteredRegister.length === 0 &&
              (Object.values(selectedKeys).some((v) => v !== "") ||
                inputRef.current?.value) ? (
              <Box className="flex flex-col h-full items-center justify-center gap-4 text-center ">
                <IoIosSearch size={80} color="#333" className="animate-pulse" />
                <h3 className={`text-2xl font-bold text-[#232323]`}>
                  Nenhum resultado encontrado
                </h3>
                <p className={`text-lg text-[#232323]`}>
                  Verifique se os filtros estão corretos e tente novamente.
                </p>
              </Box>
            ) : (
              registers
                .sort((a, b) => {
                  if (a.status === "concluído" && b.status !== "concluído")
                    return -1;
                  if (a.status !== "concluído" && b.status === "concluído")
                    return 1;
                  return 0;
                })
                .map((task, index) => (
                  <Box
                    key={index}
                    className={`task-register-result-item border border-[#b5bac5a9] `}
                    onClick={() => handleSetRegister(task)}
                  >
                    <Box className={`main-task-register-result-item-info`}>
                      <Box className="h-[30px] w-[30px] rounded-full flex items-center justify-center p-2 animate-pulse bg-[#00000014]">
                        <FaCircle size={13} color="#0fb6ff" />
                      </Box>
                      <Box className="task-register-result-item-info">
                        <h3
                          className={`text-[#232323] text-[.7rem] lg:text-[1.2rem]`}
                        >
                          {task?.titulo}
                        </h3>
                        <Box className="flex flex-col gap-2">
                          <Box className="font-semibold text-[.7rem] lg:text-[1rem] text-[#999999]">
                            {task?.descricao}
                          </Box>
                          <Box
                            className={`font-normal text-[.9rem] text-[#232323] flex gap-2`}
                          >
                            <Box> {formatDate(task?.dataCriacao as never)}</Box>
                            -
                            <Box className="font-semibold">
                              {formatDate(task?.dataConclusao as never)}
                            </Box>
                          </Box>
                          <Box
                            className={`status-ata-register font-normal text-[.7rem] lg:text-[1rem] bg-[#00487B]text-[#fff]" text-[#fff]  rounded-full px-2 w-fit`}
                          >
                            {task?.status}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <TaskStatus
                      status={task?.status as string}
                      position={true}
                    />
                  </Box>
                ))
            )}
          </Box>
        </Box>
      </MainContainerOverflow>
    </Box>
  );
}
