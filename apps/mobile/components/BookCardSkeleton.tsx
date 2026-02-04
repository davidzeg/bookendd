import { XStack, YStack } from "tamagui";

export function BookCardSkeleton() {
  return (
    <XStack
      backgroundColor="$color2"
      borderRadius="$4"
      padding="$3"
      gap="$3"
      borderWidth={1}
      borderColor="$color4"
    >
      <YStack
        width={60}
        height={90}
        borderRadius="$3"
        backgroundColor="$color3"
      />
      <YStack flex={1} justifyContent="center" gap="$2">
        <YStack
          height={20}
          width="80%"
          borderRadius="$2"
          backgroundColor="$color3"
        />
        <YStack
          height={14}
          width="50%"
          borderRadius="$2"
          backgroundColor="$color4"
        />
        <YStack
          height={12}
          width="20%"
          borderRadius="$2"
          backgroundColor="$color4"
        />
      </YStack>
    </XStack>
  );
}
