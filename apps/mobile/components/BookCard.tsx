import { Text, XStack, YStack } from "tamagui";
import { BookCover } from "./ui/BookCover";
import { RADIUS_MD, SHADOW_SUBTLE } from "./ui/tokens";

interface BookCardProps {
  title: string;
  author: string | null;
  coverUrl: string | null;
  year: number | null;
  onPress?: () => void;
}

export function BookCard({
  title,
  author,
  coverUrl,
  year,
  onPress,
}: BookCardProps) {
  const accessibilityLabel = [
    title,
    author ? `by ${author}` : null,
    year ? `published ${year}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <XStack
      backgroundColor="$color2"
      borderRadius={RADIUS_MD}
      padding="$3"
      gap="$3"
      pressStyle={{ opacity: 0.7, scale: 0.98 }}
      onPress={onPress}
      borderWidth={1}
      borderColor="$color3"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint="Tap to log this book"
      style={SHADOW_SUBTLE}
    >
      <BookCover uri={coverUrl} size="card" />
      <YStack flex={1} justifyContent="center" gap="$1">
        <Text fontSize="$5" fontWeight="700" color="$color12" numberOfLines={2}>
          {title}
        </Text>
        {author && (
          <Text fontSize="$3" color="$color11" numberOfLines={1}>
            {author}
          </Text>
        )}
        {year && (
          <Text fontSize="$2" color="$color10">
            {year}
          </Text>
        )}
      </YStack>
    </XStack>
  );
}
