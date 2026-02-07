import { XStack, Text } from "tamagui";
import { CheckCircle, XCircle } from "@tamagui/lucide-icons";
import { Button } from "./Button";
import { haptics } from "@/lib/haptics";

interface StatusButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  variant: "finished" | "dnf";
}

export function StatusButton({
  label,
  selected,
  onPress,
  variant,
}: StatusButtonProps) {
  const themeName = variant === "finished" ? "success" : "error";
  const Icon = variant === "finished" ? CheckCircle : XCircle;

  const handlePress = () => {
    haptics.selection();
    onPress();
  };

  return (
    <Button
      flex={1}
      size="$5"
      theme={selected ? themeName : undefined}
      variant={selected ? undefined : "outlined"}
      pressStyle={{ opacity: 0.8, scale: 0.97 }}
      onPress={handlePress}
      accessibilityLabel={`Mark as ${label}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      minHeight={56}
    >
      <XStack gap="$2" alignItems="center">
        <Icon
          size={20}
          color={selected ? "$color12" : "$color10"}
        />
        <Text
          fontWeight={selected ? "700" : "500"}
          fontSize="$4"
          color={selected ? "$color12" : "$color11"}
        >
          {label}
        </Text>
      </XStack>
    </Button>
  );
}
