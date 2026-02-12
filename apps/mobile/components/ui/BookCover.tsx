import { Image, YStack, Text } from "tamagui";
import { BookOpen } from "@tamagui/lucide-icons";
import { COVER, RADIUS_MD, SHADOW_BOOK, type CoverSize } from "./tokens";

interface BookCoverProps {
  uri: string | null | undefined;
  size: CoverSize;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function BookCover({
  uri,
  size,
  onPress,
  accessibilityLabel,
}: BookCoverProps) {
  const dims = COVER[size];

  return (
    <YStack
      width={dims.w}
      height={dims.h}
      borderRadius={RADIUS_MD}
      overflow="hidden"
      style={SHADOW_BOOK}
      {...(onPress
        ? {
            onPress,
            pressStyle: { opacity: 0.85, scale: 0.97 },
            accessibilityRole: "button" as const,
            accessibilityLabel,
          }
        : accessibilityLabel
          ? { accessibilityLabel }
          : {})}
    >
      {uri ? (
        <Image
          src={uri}
          width={dims.w}
          height={dims.h}
          backgroundColor="$color3"
        />
      ) : (
        <YStack
          flex={1}
          backgroundColor="$color3"
          alignItems="center"
          justifyContent="center"
          gap="$1"
        >
          <BookOpen size={Math.round(dims.w * 0.3)} color="$color7" />
          <Text fontSize={Math.max(9, Math.round(dims.w * 0.1))} color="$color7">
            No Cover
          </Text>
        </YStack>
      )}
    </YStack>
  );
}
