import { ReactNode } from "react";
import { Text, XStack } from "tamagui";
import { RADIUS_SM, SHADOW_SUBTLE } from "./tokens";

interface StatPillProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
}

export function StatPill({ value, label, icon }: StatPillProps) {
  return (
    <XStack
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color3"
      paddingHorizontal="$4"
      paddingVertical={10}
      borderRadius={RADIUS_SM}
      alignItems="center"
      gap="$2"
      style={SHADOW_SUBTLE}
    >
      {icon}
      <Text fontSize="$5" fontWeight="800" color="$color12">
        {value}
      </Text>
      <Text fontSize="$3" color="$color11">
        {label}
      </Text>
    </XStack>
  );
}
