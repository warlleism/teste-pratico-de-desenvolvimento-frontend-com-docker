import { Box } from "@mui/material";
import { FaCircle } from "react-icons/fa";

export default function CirclePulse({
  status,
  ata,
}: {
  status?: string;
  ata?: boolean;
}) {
  const statusColor: Record<string, string> = {
    pendente: "#ebdd02",
    concluída: "#01f364",
    "em andamento": "#473219",
  };

  return (
    <Box className="h-[30px] w-[30px] rounded-full flex items-center justify-center p-2 animate-pulse bg-[#00000014]">
      <FaCircle size={13} />
    </Box>
  );
}
