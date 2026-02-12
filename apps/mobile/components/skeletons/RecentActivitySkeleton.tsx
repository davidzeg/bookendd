import { XStack, YStack } from "tamagui";
import { SkeletonBox } from "./SkeletonBox";
import { COVER, RADIUS_MD } from "../ui/tokens";

export function RecentActivitySkeleton() {
  return (
    <XStack gap={16} overflow="hidden">
      {[1, 2, 3, 4].map((i) => (
        <YStack key={i} gap="$2" alignItems="center">
          <SkeletonBox width={COVER.shelf.w} height={COVER.shelf.h} borderRadius={RADIUS_MD} />
          <SkeletonBox width={50} height={14} borderRadius={4} />
        </YStack>
      ))}
    </XStack>
  );
}
