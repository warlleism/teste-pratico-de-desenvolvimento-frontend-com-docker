"use client";

import { Box, Skeleton, Tooltip } from "@mui/material";
import ModaltaskDelete from "./components/modalDelete";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import formatDate from "../../utils/formateDate";
import { redirect } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useTaskStore } from "@/app/store/storeTask";
import TaskStatus from "@/app/components/TaskStatus/meetingStatus";
import MainContainerOverflow from "@/app/styles/container/container";
import ModalTaskEdit from "./components/modalEdit";

export default function DetailRegister() {
  const { task } = useTaskStore();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const handleClose = () => {
    redirect("/");
  };

  return (
    <Box className="w-full h-[100vh] flex flex-col items-center justify-center">
      <MainContainerOverflow>
        <ModaltaskDelete
          isOpenDelete={isOpenDelete}
          onOpenDeleteChange={() => setIsOpenDelete(!isOpenDelete)}
          id={task?.id}
        />
        <ModalTaskEdit
          isOpenEdit={isOpenEdit}
          onOpenEditChange={() => setIsOpenEdit(!isOpenEdit)}
          data={task}
        />
        <Box className="flex flex-col gap-[50px] w-full h-full p-5 bg-[#f7f7f7] rounded-lg shadow-md">
          <Box>
            <Box className="flex flex-col gap-6 overflow-y-auto">
              <Box className="flex flex-row justify-between items-center">
                <Box className="flex flex-row gap-2 items-center">
                  {task ? (
                    <h3 className="text-black text-[1.5rem] font-semibold">
                      {task?.titulo}
                    </h3>
                  ) : (
                    <Skeleton
                      variant="rectangular"
                      className="rounded-lg w-[200px]"
                    />
                  )}
                </Box>
                <IoClose
                  color="#232323"
                  className="cursor-pointer text-[20px] sm:text-[30px] border-2 border-[#2d2d2d] rounded-full mr-2"
                  onClick={() => handleClose()}
                />
              </Box>
              <Box className="h-[1px] w-full bg-[#4141412e] rounded-full mb-3 mt-3" />
              <Box className="flex flex-row gap-2 items-center">
                <Box className="text-[1rem] text-black font-semibold">
                  Status:
                </Box>
                {task ? (
                  <TaskStatus
                    status={task?.status as string}
                    position={false}
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="rounded-lg w-[200px]"
                  />
                )}
              </Box>
              <Box className="flex flex-row gap-2 items-center">
                <Box className="text-[1rem] text-black font-semibold">
                  Descrição:
                </Box>
                {task ? (
                  <Box className="font-normal text-[1rem] text-black">
                    {task?.descricao}
                  </Box>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="rounded-lg w-[200px]"
                  />
                )}
              </Box>
              <Box className="flex flex-row gap-2 items-center">
                <Box className="text-[1rem] text-black font-semibold">
                  Data de criação:
                </Box>
                {task ? (
                  <Box className="font-normal text-[1rem] text-black">
                    {formatDate(task?.dataCriacao as never)}
                  </Box>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="rounded-lg w-[200px]"
                  />
                )}
              </Box>
              <Box className="flex flex-row gap-2 items-center">
                <Box className="text-[1rem] text-black font-semibold">
                  Data de conclusão:
                </Box>
                {task ? (
                  <Box className="font-normal text-[1rem] text-black">
                    {formatDate(task?.dataConclusao as never)}
                  </Box>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="rounded-lg w-[200px]"
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Box className="flex flex-col gap-5 ">
            <Box className="text-[#474747] text-[1.3rem] font-semibold">
              Opções
            </Box>
            <Box className="flex flex-row gap-2 items-center">
              <Tooltip title="Editar" arrow>
                <Box
                  className="cursor-pointer w-[50px] h-[50px] flex items-center justify-center bg-[#e6e6e6] rounded-full p-2 hover:bg-[#cecece] transition-all duration-200 shadow-md"
                  onClick={() => setIsOpenEdit(true)}
                >
                  <MdOutlineEdit color="#000" size={20} />
                </Box>
              </Tooltip>

              <Tooltip title="Deletar" arrow>
                <Box
                  onClick={() => setIsOpenDelete(true)}
                  className="cursor-pointer w-[50px] h-[50px] flex items-center justify-center bg-[#e6e6e6] rounded-full p-2 hover:bg-[#cecece] transition-all duration-200 shadow-md"
                >
                  <FaRegTrashAlt color="#000" size={16} />
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </MainContainerOverflow>
    </Box>
  );
}
