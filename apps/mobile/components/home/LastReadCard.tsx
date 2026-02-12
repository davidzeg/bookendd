import { Text, XStack, YStack, Theme, useTheme } from "tamagui";
import { Star } from "@tamagui/lucide-icons";
import { BookCover } from "@/components/ui/BookCover";
import { RADIUS_MD } from "@/components/ui/tokens";

interface LastReadCardProps {
  book: {
    title: string;
    coverUrl: string | null;
  };
  status: "FINISHED" | "DNF" | "READING";
  rating: number | null;
  word: string | null;
}

export function LastReadCard({
  book,
  status,
  rating,
  word,
}: LastReadCardProps) {
  const theme = useTheme();
  return (
    <YStack gap="$3">
      <Text
        fontSize="$3"
        color="$color10"
        fontWeight="600"
        textTransform="uppercase"
        style={{ letterSpacing: 0.8 }}
      >
        Last logged
      </Text>
      <XStack
        backgroundColor="$color2"
        borderRadius={RADIUS_MD}
        padding="$4"
        gap="$4"
        alignItems="center"
      >
        <BookCover uri={book.coverUrl} size="card" />

        <YStack flex={1} gap="$2">
          <Text
            fontSize="$4"
            fontWeight="700"
            color="$color12"
            numberOfLines={2}
          >
            {book.title}
          </Text>

          <XStack gap="$2" alignItems="center" flexWrap="wrap">
            {status === "FINISHED" && rating !== null && (
              <Theme name="star">
                <XStack gap={3} alignItems="center">
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
