import { Text, Spinner, type TextProps } from "tamagui";

interface TextButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  color?: TextProps["color"];
  fontWeight?: TextProps["fontWeight"];
  fontSize?: TextProps["fontSize"];
}

export function TextButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  color = "$accent10",
  fontWeight = "500",
  fontSize = "$4",
}: TextButtonProps) {
  if (loading) {
    return <Spinner size="small" color={color} />;
  }

  return (
    <Text
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={disabled ? "$color8" : color}
      onPress={disabled ? undefined : onPress}
      pressStyle={disabled ? undefined : { opacity: 0.7 }}
    >
      {label}
    </Text>
  );
}
