import { Text, XStack, YStack } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <XStack alignItems="center" justifyContent="space-between" marginBottom={4}>
      <XStack alignItems="center" gap="$3">
        <YStack
          width={4}
          height={24}
          backgroundColor="$accent9"
          borderRadius={2}
        />
        <Text
          fontSize="$7"
          fontWeight="700"
          color="$color12"
          accessibilityRole="header"
        >
          {title}
        </Text>
      </XStack>

      {actionLabel && onAction && (
        <XStack
          alignItems="center"
          gap="$1"
          onPress={onAction}
          pressStyle={{ opacity: 0.7 }}
        >
          <Text
            fontSize="$3"
            color="$accent10"
            fontWeight="600"
          >
            {actionLabel}
          </Text>
          <ChevronRight size={14} color="$accent10" />
        </XStack>
      )}
    </XStack>
  );
}
