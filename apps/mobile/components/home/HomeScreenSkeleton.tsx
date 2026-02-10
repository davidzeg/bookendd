import { XStack, YStack } from "tamagui";
import { SkeletonBox } from "@/components/skeletons";

function FeedCardSkeleton() {
  return (
    <YStack
      backgroundColor="$color2"
      borderRadius={12}
      padding="$3"
      gap="$3"
    >
      <XStack gap="$2" alignItems="center">
        <SkeletonBox width={32} height={32} borderRadius={16} />
        <SkeletonBox width={100} height={14} borderRadius={4} />
        <SkeletonBox width={40} height={12} borderRadius={4} />
      </XStack>
      <XStack gap="$3" alignItems="center">
        <SkeletonBox width={48} height={72} borderRadius={6} />
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
    <YStack gap="$6" padding="$4">
      {/* Greeting header skeleton */}
      <YStack
        backgroundColor="$color2"
        borderRadius={16}
        padding="$5"
        gap="$2"
      >
        <SkeletonBox width={100} height={16} borderRadius={4} />
        <SkeletonBox width={180} height={32} borderRadius={6} />
      </YStack>

      {/* Currently reading shelf skeleton */}
      <YStack gap="$3">
        <SkeletonBox width={130} height={14} borderRadius={4} />
        <XStack gap={12}>
          <SkeletonBox width={80} height={120} borderRadius={8} />
          <SkeletonBox width={80} height={120} borderRadius={8} />
          <SkeletonBox width={80} height={120} borderRadius={8} />
        </XStack>
      </YStack>

      {/* Search CTA skeleton */}
      <SkeletonBox width="100%" height={88} borderRadius={16} />

      {/* Feed skeleton */}
      <YStack gap="$3">
        <SkeletonBox width={160} height={14} borderRadius={4} />
        <FeedCardSkeleton />
        <FeedCardSkeleton />
        <FeedCardSkeleton />
      </YStack>
    </YStack>
  );
}
