import { XStack, YStack } from "tamagui";
import { SkeletonBox } from "./SkeletonBox";

export function RecentActivitySkeleton() {
  return (
    <XStack gap="$4" overflow="hidden">
      {[1, 2, 3, 4].map((i) => (
        <YStack key={i} gap="$2" alignItems="center">
          <SkeletonBox width={67} height={120} borderRadius={6} />
          <SkeletonBox width={50} height={14} borderRadius={4} />
        </YStack>
      ))}
    </XStack>
  );
}
