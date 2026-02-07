import { XStack, YStack } from "tamagui";
import { SkeletonBox } from "@/components/skeletons";

export function HomeScreenSkeleton() {
  return (
    <YStack gap="$8" padding="$4">
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

      {/* Stats skeleton */}
      <XStack gap="$3">
        <SkeletonBox width={90} height={40} borderRadius={12} />
        <SkeletonBox width={80} height={40} borderRadius={12} />
      </XStack>

      {/* Search CTA skeleton */}
      <SkeletonBox width="100%" height={88} borderRadius={16} />

      {/* Last read card skeleton */}
      <YStack gap="$3">
        <SkeletonBox width={80} height={14} borderRadius={4} />
        <XStack
          backgroundColor="$color2"
          borderRadius={12}
          padding="$4"
          gap="$4"
          alignItems="center"
        >
          <SkeletonBox width={60} height={90} borderRadius={6} />
          <YStack flex={1} gap="$2">
            <SkeletonBox width="80%" height={18} borderRadius={4} />
            <SkeletonBox width={100} height={14} borderRadius={4} />
            <SkeletonBox width={60} height={14} borderRadius={4} />
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  );
}
