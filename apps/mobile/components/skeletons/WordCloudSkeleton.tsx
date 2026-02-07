import { XStack } from "tamagui";
import { SkeletonBox } from "./SkeletonBox";

const WORD_WIDTHS = [80, 60, 100, 50, 70, 90, 55, 75, 65, 85];

export function WordCloudSkeleton() {
  return (
    <XStack flexWrap="wrap" gap="$2" justifyContent="center" paddingVertical="$2">
      {WORD_WIDTHS.map((width, i) => (
        <SkeletonBox
          key={i}
          width={width}
          height={20 + (i % 3) * 6}
          borderRadius={4}
        />
      ))}
    </XStack>
  );
}
