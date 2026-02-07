import { ReactNode } from "react";
import { Text, XStack } from "tamagui";

interface StatPillProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
}

export function StatPill({ value, label, icon }: StatPillProps) {
  return (
    <XStack
      backgroundColor="$color2"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius={12}
      alignItems="center"
      gap="$2"
    >
      {icon}
      <Text fontSize="$4" fontWeight="700" color="$color12">
        {value}
      </Text>
      <Text fontSize="$2" color="$color10">
        {label}
      </Text>
    </XStack>
  );
}
