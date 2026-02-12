import { XStack, YStack } from "tamagui";
import { SkeletonBox } from "@/components/skeletons";
import { COVER, RADIUS_MD, RADIUS_LG, SCREEN_PADDING_H } from "@/components/ui/tokens";

function FeedCardSkeleton() {
  return (
    <YStack
      backgroundColor="$color2"
      borderRadius={RADIUS_MD}
      padding="$3"
      gap="$3"
    >
      <XStack gap="$2" alignItems="center">
        <SkeletonBox width={32} height={32} borderRadius={16} />
        <SkeletonBox width={100} height={14} borderRadius={4} />
        <SkeletonBox width={40} height={12} borderRadius={4} />
      </XStack>
      <XStack gap="$3" alignItems="center">
        <SkeletonBox width={COVER.feed.w} height={COVER.feed.h} borderRadius={RADIUS_MD} />
        <YStack flex={1} gap="$1">
          <SkeletonBox width={80} height={12} borderRadius={4} />
          <SkeletonBox width="90%" height={16} borderRadius={4} />
          <SkeletonBox width={60} height={12} borderRadius={4} />
        </YStack>
      </XStack>
    </YStack>
  );
}

export function HomeScreenSkeleton() {
  return (
    <YStack gap="$8" paddingHorizontal={SCREEN_PADDING_H}>
      {/* Greeting header skeleton */}
      <YStack
        backgroundColor="$color2"
        borderRadius={RADIUS_LG}
        padding="$5"
        gap="$2"
      >
        <SkeletonBox width={100} height={14} borderRadius={4} />
        <SkeletonBox width={180} height={36} borderRadius={6} />
      </YStack>

      {/* Currently reading shelf skeleton */}
      <YStack gap="$3">
        <SkeletonBox width={160} height={18} borderRadius={4} />
        <XStack gap={16}>
          <SkeletonBox width={COVER.shelf.w} height={COVER.shelf.h} borderRadius={RADIUS_MD} />
          <SkeletonBox width={COVER.shelf.w} height={COVER.shelf.h} borderRadius={RADIUS_MD} />
          <SkeletonBox width={COVER.shelf.w} height={COVER.shelf.h} borderRadius={RADIUS_MD} />
        </XStack>
      </YStack>

      {/* Search CTA skeleton */}
      <SkeletonBox width="100%" height={88} borderRadius={RADIUS_LG} />

      {/* Feed skeleton */}
      <YStack gap="$3">
        <SkeletonBox width={180} height={18} borderRadius={4} />
        <FeedCardSkeleton />
        <FeedCardSkeleton />
        <FeedCardSkeleton />
      </YStack>
    </YStack>
  );
}
