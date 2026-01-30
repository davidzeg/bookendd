import { XStack, YStack } from "tamagui";

export function BookCardSkeleton() {
  return (
    <XStack
      backgroundColor="$background"
      borderRadius="$4"
      padding="$3"
      gap="$3"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <YStack
        width={60}
        height={90}
        borderRadius="$2"
        backgroundColor="$gray5"
      />
      <YStack flex={1} justifyContent="center" gap="$2">
        <YStack
          height={20}
          width="80%"
          borderRadius="$2"
          backgroundColor="$gray5"
        />
        <YStack
          height={14}
          width="50%"
          borderRadius="$2"
          backgroundColor="$gray4"
        />
        <YStack
          height={12}
          width="20%"
          borderRadius="$2"
          backgroundColor="$gray4"
        />
      </YStack>
    </XStack>
  );
}
