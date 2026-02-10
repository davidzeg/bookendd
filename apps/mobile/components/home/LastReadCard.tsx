import { Image, Text, XStack, YStack, Theme, useTheme } from "tamagui";
import { Star } from "@tamagui/lucide-icons";

interface LastReadCardProps {
  book: {
    title: string;
    coverUrl: string | null;
  };
  status: "FINISHED" | "DNF" | "READING";
  rating: number | null;
  word: string | null;
}

const PLACEHOLDER_COVER =
  "https://placehold.co/80x120/1a1a2e/666666?text=No+Cover";

export function LastReadCard({
  book,
  status,
  rating,
  word,
}: LastReadCardProps) {
  const theme = useTheme();
  return (
    <YStack gap="$3">
      <Text fontSize="$3" color="$color10" fontWeight="500">
        Last logged
      </Text>
      <XStack
        backgroundColor="$color2"
        borderRadius={12}
        padding="$4"
        gap="$4"
        alignItems="center"
      >
        <YStack
          borderRadius={6}
          overflow="hidden"
          shadowColor="$color1"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={8}
        >
          <Image
            src={book.coverUrl || PLACEHOLDER_COVER}
            width={60}
            height={90}
            objectFit="cover"
          />
        </YStack>

        <YStack flex={1} gap="$2">
          <Text
            fontSize="$4"
            fontWeight="600"
            color="$color12"
            numberOfLines={2}
          >
            {book.title}
          </Text>

          <XStack gap="$2" alignItems="center" flexWrap="wrap">
            {status === "FINISHED" && rating !== null && (
              <Theme name="star">
                <XStack gap={2} alignItems="center">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      color="$accent10"
                      fill={theme.accent10.get()}
                    />
                  ))}
                </XStack>
              </Theme>
            )}
            {status === "DNF" && (
              <Theme name="error">
                <XStack
                  backgroundColor="$accent4"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius={4}
                >
                  <Text fontSize={11} fontWeight="700" color="$accent11">
                    DNF
                  </Text>
                </XStack>
              </Theme>
            )}
          </XStack>

          {word && (
            <Text fontSize="$3" color="$accent10" fontStyle="italic">
              "{word}"
            </Text>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
}
