import { Text, XStack, YStack } from "tamagui";

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
    <XStack alignItems="center" justifyContent="space-between">
      <XStack alignItems="center" gap="$3">
        <YStack
          width={3}
          height={20}
          backgroundColor="$accent8"
          borderRadius="$1"
        />
        <Text fontSize="$5" fontWeight="600" color="$color12">
          {title}
        </Text>
      </XStack>

      {actionLabel && onAction && (
        <Text
          fontSize="$3"
          color="$accent10"
          fontWeight="500"
          onPress={onAction}
          pressStyle={{ opacity: 0.7 }}
        >
          {actionLabel}
        </Text>
      )}
    </XStack>
  );
}
