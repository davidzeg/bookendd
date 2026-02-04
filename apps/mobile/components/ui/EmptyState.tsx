import { Text, YStack } from "tamagui";

interface EmptyStateProps {
  title: string;
  description?: string;
  minHeight?: number;
}

/**
 * Standardized empty state with dashed border
 * Per DESIGN_SYSTEM.md: dashed border, $color4, centered content
 */
export function EmptyState({
  title,
  description,
  minHeight = 140,
}: EmptyStateProps) {
  return (
    <YStack
      padding="$6"
      borderRadius="$4"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
      borderWidth={2}
      borderColor="$color4"
      style={{ borderStyle: "dashed" }}
    >
      <Text color="$color10" fontSize="$4" fontWeight="500">
        {title}
      </Text>
      {description && (
        <Text
          fontSize="$3"
          color="$color9"
          marginTop="$2"
          textAlign="center"
          maxWidth={280}
        >
          {description}
        </Text>
      )}
    </YStack>
  );
}
