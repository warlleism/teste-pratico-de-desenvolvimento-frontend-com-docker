import { Box, Button, CircularProgress, Modal } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaExclamationTriangle } from "react-icons/fa";
import { useDeleteTasks } from "@/app/hooks/tasks/useDeleteHook";

export default function ModalTaskDelete({
  isOpenDelete,
  onOpenDeleteChange,
  id,
}: {
  isOpenDelete: boolean;
  onOpenDeleteChange: () => void;
  id: number | undefined;
}) {
  const { deleteTask, loading } = useDeleteTasks();

  const handleDelete = () => {
    deleteTask(id as number);
  };
  return (
    <Modal
      open={isOpenDelete}
      onClose={onOpenDeleteChange}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <IoIosCloseCircleOutline
          size={40}
          color="#fff"
          onClick={() => onOpenDeleteChange()}
          className={`absolute top-3 right-3 lg:right-8 z-10 cursor-pointer transition duration-300 ease-in-out hover:scale-110`}
        />
        <Box
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit 
            bg-white text-black rounded-2xl px-9 py-5 flex flex-col gap-5 `}
        >
          <Box className="mb-4 text-[1rem] flex flex-col gap-2">
            <Box className="flex items-center gap-2">
              <FaExclamationTriangle size={26} color="#00aafd" />
              <Box className="font-[500] text-[1.2rem] text-black">
                Esta ação é permanente
              </Box>
            </Box>

            <Box className="flex flex-col gap-2">
              <Box>
                <Box className="text-[.9rem] text-[#696969]">
                  Tem certeza de que deseja excluir esta tarefa?
                </Box>
                <Box className="text-[.9rem] text-[#696969]">
                  Esta ação não pode ser desfeita.
                </Box>
                <Box className="text-[.7rem] text-[red]">
                  (Tarefas excluidas estarão na aba de histórico)
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="flex justify-end gap-[10px]">
            <Button
              variant="contained"
              type="submit"
              className="default-button bg-primary text-white py-2 rounded-2xl mt-4"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                "Sim, excluir"
              )}
            </Button>
            <Button
              onClick={() => onOpenDeleteChange()}
              variant="contained"
              color="error"
              type="submit"
              className="default-cancel-button bg-primary text-white py-2 rounded-2xl mt-4"
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
