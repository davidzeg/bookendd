import { XStack, YStack } from "tamagui";
import { SkeletonBox } from "./SkeletonBox";
import { RADIUS_LG } from "../ui/tokens";

const WORD_WIDTHS = [80, 60, 100, 50, 70, 90, 55, 75, 65, 85];

export function WordCloudSkeleton() {
  return (
    <YStack
      borderWidth={1}
      borderColor="$color3"
      borderRadius={RADIUS_LG}
      padding="$5"
    >
      <XStack flexWrap="wrap" gap="$2" justifyContent="center">
        {WORD_WIDTHS.map((width, i) => (
          <SkeletonBox
            key={i}
            width={width}
            height={20 + (i % 3) * 6}
            borderRadius={4}
          />
        ))}
      </XStack>
    </YStack>
  );
}
