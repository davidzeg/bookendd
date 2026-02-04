import { Image, Text, XStack, YStack } from "tamagui";

interface BookCardProps {
  title: string;
  author: string | null;
  coverUrl: string | null;
  year: number | null;
  onPress?: () => void;
}

const PLACEHOLDER_COVER =
  "https://placehold.co/60x90/1a1a2e/666666?text=No+Cover";

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
      borderRadius="$4"
      padding="$3"
      gap="$3"
      pressStyle={{ opacity: 0.7, scale: 0.98 }}
      onPress={onPress}
      borderWidth={1}
      borderColor="$color4"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint="Tap to log this book"
    >
      <YStack
        borderRadius="$3"
        overflow="hidden"
        shadowColor="$color1"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.2}
        shadowRadius={4}
      >
        <Image
          src={coverUrl ?? PLACEHOLDER_COVER}
          width={60}
          height={90}
          backgroundColor="$color3"
        />
      </YStack>
      <YStack flex={1} justifyContent="center" gap="$1">
        <Text fontSize="$5" fontWeight="600" color="$color12" numberOfLines={2}>
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
