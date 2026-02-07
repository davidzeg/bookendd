import { XStack, YStack } from "tamagui";
import { SkeletonBox } from "./SkeletonBox";

export function ProfileViewSkeleton() {
  return (
    <YStack gap="$8" padding="$4">
      {/* Header gradient section */}
      <YStack
        backgroundColor="$color2"
        borderRadius={16}
        padding="$4"
        gap="$4"
      >
        {/* Avatar and name row */}
        <XStack gap="$4" alignItems="center">
          <SkeletonBox width={96} height={96} borderRadius={48} />
          <YStack flex={1} gap="$2">
            <SkeletonBox width="70%" height={28} borderRadius={6} />
            <SkeletonBox width="50%" height={18} borderRadius={4} />
          </YStack>
        </XStack>

        {/* Bio */}
        <YStack gap="$2">
          <SkeletonBox width="100%" height={16} borderRadius={4} />
          <SkeletonBox width="80%" height={16} borderRadius={4} />
        </YStack>

        {/* Stats */}
        <XStack gap="$3">
          <SkeletonBox width={90} height={36} borderRadius={12} />
          <SkeletonBox width={80} height={36} borderRadius={12} />
        </XStack>

        {/* Buttons */}
        <XStack gap="$3">
          <SkeletonBox flex={1} height={40} borderRadius={8} />
          <SkeletonBox width={80} height={40} borderRadius={8} />
        </XStack>
      </YStack>

      {/* Favorites section */}
      <YStack gap="$4">
        <XStack alignItems="center" gap="$3">
          <SkeletonBox width={3} height={20} borderRadius={2} />
          <SkeletonBox width={120} height={20} borderRadius={4} />
        </XStack>
        <XStack gap="$3">
          {[1, 2, 3, 4].map((i) => (
            <YStack key={i} gap="$2">
              <SkeletonBox width={80} height={120} borderRadius={6} />
              <SkeletonBox width={70} height={12} borderRadius={4} />
            </YStack>
          ))}
        </XStack>
      </YStack>

      {/* Word cloud section */}
      <YStack gap="$4">
        <XStack alignItems="center" gap="$3">
          <SkeletonBox width={3} height={20} borderRadius={2} />
          <SkeletonBox width={100} height={20} borderRadius={4} />
        </XStack>
        <XStack flexWrap="wrap" gap="$2" justifyContent="center">
          {[80, 60, 100, 50, 70, 90, 55, 75].map((width, i) => (
            <SkeletonBox key={i} width={width} height={24} borderRadius={4} />
          ))}
        </XStack>
      </YStack>

      {/* Recent activity section */}
      <YStack gap="$4">
        <XStack alignItems="center" gap="$3">
          <SkeletonBox width={3} height={20} borderRadius={2} />
          <SkeletonBox width={130} height={20} borderRadius={4} />
        </XStack>
        <XStack gap="$4">
          {[1, 2, 3].map((i) => (
            <YStack key={i} gap="$2">
              <SkeletonBox width={80} height={120} borderRadius={6} />
              <SkeletonBox width={60} height={12} borderRadius={4} />
            </YStack>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
}
