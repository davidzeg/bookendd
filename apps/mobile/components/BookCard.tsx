import { Image, Text, XStack, YStack } from "tamagui";
import { Image as RNImage } from "react-native";

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
  return (
    <XStack
      backgroundColor="$background"
      borderRadius="$4"
      padding="$3"
      gap="$3"
      pressStyle={{ opacity: 0.7, scale: 0.98 }}
      onPress={onPress}
      borderWidth={1}
      borderColor="$borderColor"
    >
      <Image
        src={coverUrl ?? PLACEHOLDER_COVER}
        width={60}
        height={90}
        borderRadius="$2"
        backgroundColor="$gray5"
      />
      <YStack flex={1} justifyContent="center" gap="$1">
        <Text fontSize="$5" fontWeight="600" numberOfLines={2}>
          {title}
        </Text>
        {author && (
          <Text fontSize="$3" color="$gray11" numberOfLines={1}>
            {author}
          </Text>
        )}
        {year && (
          <Text fontSize="$2" color="$gray10">
            {year}
          </Text>
        )}
      </YStack>
    </XStack>
  );
}
