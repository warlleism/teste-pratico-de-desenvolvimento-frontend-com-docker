import { Button } from "@mui/material";

export default function IconButton({
  icon,
  text,
  type,
  disabled,
  onPress,
}: {
  disabled?: boolean;
  icon: React.ReactElement;
  text: string;
  type?: string;
  onPress?: () => void;
}) {
  return (
    <Button
      variant="contained"
      disabled={disabled}
      type={type as any}
      className="default-button flex flex-row gap-2 w-full items-center disabled:opacity-50 z-10"
      onClick={onPress}
    >
      {icon} {text}
    </Button>
  );
}
