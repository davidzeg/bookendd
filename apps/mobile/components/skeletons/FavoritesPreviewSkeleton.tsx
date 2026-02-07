import { XStack, YStack } from "tamagui";
import { SkeletonBox } from "./SkeletonBox";

export function FavoritesPreviewSkeleton() {
  return (
    <XStack gap="$3" overflow="hidden">
      {[1, 2, 3, 4].map((i) => (
        <YStack key={i} gap="$2" alignItems="center">
          <SkeletonBox width={80} height={120} borderRadius={6} />
          <SkeletonBox width={70} height={12} borderRadius={4} />
        </YStack>
      ))}
    </XStack>
  );
}
