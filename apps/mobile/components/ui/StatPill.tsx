import { Text, XStack } from "tamagui";

interface StatPillProps {
  value: string | number;
  label: string;
}

/**
 * Small stat display pill for profile stats row
 * Shows a value with a label (e.g., "47 books", "4.2 avg")
 */
export function StatPill({ value, label }: StatPillProps) {
  return (
    <XStack
      backgroundColor="$color2"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$3"
      alignItems="center"
      gap="$2"
    >
      <Text fontSize="$4" fontWeight="700" color="$color12">
        {value}
      </Text>
      <Text fontSize="$2" color="$color10">
        {label}
      </Text>
    </XStack>
  );
}
