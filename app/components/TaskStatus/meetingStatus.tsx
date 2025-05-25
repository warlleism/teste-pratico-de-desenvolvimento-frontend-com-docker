import { Box } from "@mui/material";
import "./style.scss";

export default function TaskStatus({
  status,
  position,
}: {
  status: string;
  position?: boolean;
}) {
  const statusColor: Record<string, [string, string, string]> = {
    pendente: ["#f3f0c5", "#7d7500", "#fbf378"],
    concluído: ["#00ffaa40", "#00853c", "#00855d30"],
    "em andamento": ["#EEE7DC", "#8d6029", "#fbf378"],
  };

  return (
    <Box
      className="statusContainer"
      style={{
        position: position ? "absolute" : "static",
        top: position ? "10px" : "0px",
        right: position ? "10px" : "0px",
        textTransform: "uppercase",
        width: "fit-content",
        border: `solid 1px ${statusColor?.[status]?.[2]}`,
        color: statusColor?.[status]?.[1],
        backgroundColor: statusColor?.[status]?.[0],
      }}
    >
      {status}
    </Box>
  );
}
