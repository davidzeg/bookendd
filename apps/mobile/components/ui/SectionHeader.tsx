import { Text, XStack, YStack } from "tamagui";

interface SectionHeaderProps {
  title: string;
}

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
