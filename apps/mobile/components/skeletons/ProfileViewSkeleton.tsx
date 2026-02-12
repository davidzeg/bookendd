import { XStack, YStack } from "tamagui";
import { SkeletonBox } from "./SkeletonBox";
import { COVER, RADIUS_LG, RADIUS_SM, SCREEN_PADDING_H } from "../ui/tokens";

export function ProfileViewSkeleton() {
  return (
    <YStack gap="$8" padding={SCREEN_PADDING_H}>
      {/* Header gradient section */}
      <YStack
        backgroundColor="$color2"
        borderRadius={RADIUS_LG}
        padding="$4"
        gap="$4"
      >
        {/* Avatar and name row */}
        <XStack gap="$4" alignItems="center">
          <SkeletonBox width={104} height={104} borderRadius={52} />
          <YStack flex={1} gap="$2">
            <SkeletonBox width="70%" height={32} borderRadius={6} />
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
          <SkeletonBox width={90} height={40} borderRadius={RADIUS_SM} />
          <SkeletonBox width={80} height={40} borderRadius={RADIUS_SM} />
        </XStack>

        {/* Buttons */}
        <XStack gap="$3">
          <SkeletonBox flex={1} height={42} borderRadius={RADIUS_SM} />
          <SkeletonBox width={80} height={42} borderRadius={RADIUS_SM} />
        </XStack>
      </YStack>

      {/* Favorites section */}
      <YStack gap="$4">
        <XStack alignItems="center" gap="$3">
          <SkeletonBox width={4} height={24} borderRadius={2} />
          <SkeletonBox width={120} height={24} borderRadius={4} />
        </XStack>
        <XStack gap={16}>
          {[1, 2, 3, 4].map((i) => (
            <YStack key={i} gap="$2">
              <SkeletonBox width={COVER.shelf.w} height={COVER.shelf.h} borderRadius={14} />
              <SkeletonBox width={70} height={12} borderRadius={4} />
            </YStack>
          ))}
        </XStack>
      </YStack>

      {/* Word cloud section */}
      <YStack gap="$4">
        <XStack alignItems="center" gap="$3">
          <SkeletonBox width={4} height={24} borderRadius={2} />
          <SkeletonBox width={100} height={24} borderRadius={4} />
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
          <SkeletonBox width={4} height={24} borderRadius={2} />
          <SkeletonBox width={130} height={24} borderRadius={4} />
        </XStack>
        <XStack gap={16}>
          {[1, 2, 3].map((i) => (
            <YStack key={i} gap="$2">
              <SkeletonBox width={COVER.shelf.w} height={COVER.shelf.h} borderRadius={14} />
              <SkeletonBox width={60} height={14} borderRadius={4} />
            </YStack>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
}
