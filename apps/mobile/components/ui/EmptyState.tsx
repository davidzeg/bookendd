import { ReactNode } from "react";
import { Text, YStack } from "tamagui";
import { RADIUS_LG } from "./tokens";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  minHeight?: number;
}

export function EmptyState({
  title,
  description,
  icon,
  minHeight = 160,
}: EmptyStateProps) {
  return (
    <YStack
      padding="$6"
      borderRadius={RADIUS_LG}
      backgroundColor="$color2"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
      gap="$3"
    >
      {icon}
      <Text color="$color11" fontSize="$5" fontWeight="600" textAlign="center">
        {title}
      </Text>
      {description && (
        <Text
          fontSize="$3"
          color="$color9"
          textAlign="center"
          maxWidth={280}
          lineHeight={20}
        >
          {description}
        </Text>
      )}
    </YStack>
  );
}
