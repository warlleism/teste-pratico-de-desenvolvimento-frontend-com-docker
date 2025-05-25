import {
  Modal,
  Box,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTask } from "@/app/hooks/tasks/useCreateHook";

const createTaskSchema = z.object({
  titulo: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  descricao: z.string().max(500, "Descrição deve ter no máximo 500 caracteres"),
  status: z.string(),
  dataCriacao: z.string(),
  dataConclusao: z.string(),
});

type CreateFormData = z.infer<typeof createTaskSchema>;

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "em andamento", label: "Em Andamento" },
  { value: "concluído", label: "Concluído" },
];

export default function ModalTaskCreate({
  isOpenCreate,
  onOpenCreateChange,
}: {
  isOpenCreate: boolean;
  onOpenCreateChange: () => void;
}) {
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitted },
    watch,
  } = useForm<CreateFormData>({
    resolver: zodResolver(createTaskSchema),
    mode: "onChange",
    defaultValues: {
      titulo: "",
      descricao: "",
      status: "pendente",
      dataCriacao: "",
      dataConclusao: "",
    },
  });

  const { createTask, loading } = useCreateTask();

  const onSubmit = async (formData: CreateFormData) => {
    formData.dataCriacao = new Date(formData.dataCriacao).toISOString();
    formData.dataConclusao = new Date(formData.dataConclusao).toISOString();
    createTask(formData as never);
    reset();
    onOpenCreateChange();
  };

  return (
    <Modal
      open={isOpenCreate}
      onClose={() => {
        onOpenCreateChange();
        reset();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <IoIosCloseCircleOutline
          size={40}
          onClick={() => {
            onOpenCreateChange();
            reset();
          }}
          className="absolute top-3 right-3 lg:right-8 z-10 cursor-pointer transition duration-300 ease-in-out hover:scale-110 text-black lg:text-white"
        />
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full lg:w-[60vw] h-full lg:h-[80vh] justify-between p-6 bg-white text-black lg:p-4 pt-[50px] lg:rounded-2xl flex flex-col">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[100%] h-[100%] flex-col justify-between z-10 box-border p-[10px] flex items-center relative overflow-y-auto lg:overflow-hidden rounded-2xl p-[20px] bg-[#5353530a]"
          >
            <Box className="flex flex-col gap-[20px] w-[100%]">
              <Box className="text-[1.5rem] font-semibold text-start w-[100%] text-black">
                Criar Tarefa
              </Box>
              <Box className="w-full h-[1px] bg-[#0000002b]" />

              <Box className="w-full flex flex-col gap-5 mt-5">
                <Box className="flex flex-col gap-4 w-full">
                  <TextField
                    id="titulo"
                    {...register("titulo")}
                    multiline
                    minRows={1}
                    fullWidth
                    variant="outlined"
                    className="w-full"
                    sx={{
                      "& .MuiFormHelperText-root": {
                        color: "#d32f2f",
                      },
                    }}
                    slotProps={{
                      input: {
                        style: {
                          color: "#000",
                          backgroundColor: "inherit",
                        },
                      },
                    }}
                    label={
                      <span className="text-[#2b2b2b] font-light">Título</span>
                    }
                    error={!!errors.titulo}
                    helperText={errors.titulo?.message}
                  />
                </Box>

                <Box className="flex flex-col gap-4 w-full">
                  <TextField
                    id="descricao"
                    {...register("descricao")}
                    multiline
                    minRows={4}
                    fullWidth
                    variant="outlined"
                    className="w-full"
                    sx={{
                      "& .MuiFormHelperText-root": {
                        color: "#d32f2f",
                      },
                    }}
                    slotProps={{
                      input: {
                        style: {
                          color: "#000",
                          backgroundColor: "inherit",
                        },
                      },
                    }}
                    label={
                      <span className="text-[#2b2b2b] font-light">
                        Descrição
                      </span>
                    }
                    error={!!errors.descricao}
                    helperText={errors.descricao?.message}
                  />
                </Box>

                <Box className="flex flex-col gap-4 w-full">
                  <TextField
                    id="status"
                    {...register("status")}
                    select
                    fullWidth
                    variant="outlined"
                    value={watch("status")}
                    className="w-full"
                    sx={{
                      "& .MuiFormHelperText-root": {
                        color: "#d32f2f",
                      },
                    }}
                    slotProps={{
                      input: {
                        style: {
                          color: "#000",
                          backgroundColor: "inherit",
                        },
                      },
                    }}
                    label={
                      <span className="text-[#2b2b2b] font-light">Status</span>
                    }
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box className="flex flex-col gap-4 w-full">
                  <TextField
                    id="dataCriacao"
                    {...register("dataCriacao")}
                    type="datetime-local"
                    fullWidth
                    value={watch("dataCriacao")}
                    variant="outlined"
                    className="w-full"
                    sx={{
                      "& .MuiFormHelperText-root": {
                        color: "#d32f2f",
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    slotProps={{
                      input: {
                        style: {
                          color: "#000",
                          backgroundColor: "inherit",
                        },
                      },
                    }}
                    label={
                      <span className="text-[#2b2b2b] font-light">
                        Data de Criação
                      </span>
                    }
                    error={!!errors.dataCriacao}
                    helperText={errors.dataCriacao?.message}
                  />
                </Box>

                <Box className="flex flex-col gap-4 w-full">
                  <TextField
                    id="dataConclusao"
                    {...register("dataConclusao")}
                    type="datetime-local"
                    fullWidth
                    value={watch("dataConclusao") || ""}
                    variant="outlined"
                    className="w-full"
                    sx={{
                      "& .MuiFormHelperText-root": {
                        color: "#d32f2f",
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    slotProps={{
                      input: {
                        style: {
                          color: "#000",
                          backgroundColor: "inherit",
                        },
                      },
                    }}
                    label={
                      <span className="text-[#2b2b2b] font-light">
                        Data de Conclusão
                      </span>
                    }
                    error={!!errors.dataConclusao}
                    helperText={errors.dataConclusao?.message}
                  />
                </Box>
              </Box>
            </Box>

            <Box className="flex gap-[10px] w-[100%]">
              <Button
                variant="contained"
                type="submit"
                className="default-button w-[200px] py-2 rounded-2xl mt-4 disabled:opacity-50 bg-primary text-white"
                // disabled={!isValid && isSubmitted}
              >
                {loading ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  "Confirmar"
                )}
              </Button>
              <Button
                onClick={() => {
                  onOpenCreateChange();
                  reset();
                }}
                variant="contained"
                type="button"
                className="default-cancel-button w-[200px] py-2 rounded-2xl mt-4 bg-gray-300 text-black"
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}
