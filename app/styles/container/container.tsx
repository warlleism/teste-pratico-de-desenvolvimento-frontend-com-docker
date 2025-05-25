import { Box } from "@mui/material";

export default function MainContainerOverflow({
  children,
}: {
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <Box className={`h-[95vh] border bg-[#fff]  lg:p-3 w-[70%] rounded-lg`}>
      <Box className="box-border p-3 lgp-5 h-[100%] overflow-y-auto">
        {children}
      </Box>
    </Box>
  );
}
