import { XStack, YStack } from "tamagui";
import { COVER, RADIUS_MD, SHADOW_SUBTLE } from "./ui/tokens";

export function BookCardSkeleton() {
  return (
    <XStack
      backgroundColor="$color2"
      borderRadius={RADIUS_MD}
      padding="$3"
      gap="$3"
      borderWidth={1}
      borderColor="$color3"
      style={SHADOW_SUBTLE}
    >
      <YStack
        width={COVER.card.w}
        height={COVER.card.h}
        borderRadius={RADIUS_MD}
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
