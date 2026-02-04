import { Text, XStack, YStack } from "tamagui";

interface SectionHeaderProps {
  title: string;
}

/**
 * Section header with accent indicator bar
 * Per DESIGN_SYSTEM.md: accent8 vertical bar, fontSize $5, fontWeight 600
 */
export function SectionHeader({ title }: SectionHeaderProps) {
  return (
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
  );
}
