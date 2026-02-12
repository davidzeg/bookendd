import { useMemo } from "react";
import { Text, XStack } from "tamagui";
import { MessageCircle } from "@tamagui/lucide-icons";
import { EmptyState } from "./ui/EmptyState";
import { RADIUS_LG } from "./ui/tokens";

type WordFrequency = {
  word: string;
  count: number;
};

type WordCloudProps = {
  minWords?: number;
} & (
  | { words: (string | null)[]; aggregatedWords?: never }
  | { words?: never; aggregatedWords: WordFrequency[] }
);

const MIN_FONT_SIZE = 15;
const MAX_FONT_SIZE = 36;

export function WordCloud({
  words,
  aggregatedWords,
  minWords = 5,
}: WordCloudProps) {
  const wordFrequencies = useMemo(() => {
    if (aggregatedWords) {
      return [...aggregatedWords].sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.word.localeCompare(b.word);
      });
    }

    const counts = new Map<string, number>();
    for (const word of words ?? []) {
      if (!word) continue;
      const normalized = word.toLowerCase().trim();
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    }

    const frequencies: WordFrequency[] = [];
    counts.forEach((count, word) => {
      frequencies.push({ word, count });
    });

    return frequencies.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.word.localeCompare(b.word);
    });
  }, [words, aggregatedWords]);

  const totalWords = aggregatedWords
    ? aggregatedWords.reduce((sum, w) => sum + w.count, 0)
    : (words ?? []).filter(Boolean).length;

  if (totalWords < minWords) {
    const remaining = minWords - totalWords;
    return (
      <EmptyState
        title="Not enough words yet"
        description={`Log ${remaining} more book${remaining !== 1 ? "s" : ""} with descriptors`}
        icon={<MessageCircle size={40} color="$color8" />}
      />
    );
  }

  const maxCount = wordFrequencies[0]?.count || 1;
  const minCount = wordFrequencies[wordFrequencies.length - 1]?.count || 1;

  function getRatio(count: number): number {
    if (maxCount === minCount) return 0.5;
    return (count - minCount) / (maxCount - minCount);
  }

  function getFontSize(count: number): number {
    const ratio = getRatio(count);
    return Math.round(MIN_FONT_SIZE + ratio * (MAX_FONT_SIZE - MIN_FONT_SIZE));
  }

  function getFontWeight(count: number): "400" | "500" | "600" | "700" {
    const ratio = getRatio(count);
    if (ratio > 0.75) return "700";
    if (ratio > 0.5) return "600";
    if (ratio > 0.25) return "500";
    return "400";
  }

  function getOpacity(count: number): number {
    const ratio = getRatio(count);
    return 0.55 + ratio * 0.45;
  }

  function getColor(count: number): "$accent10" | "$color11" | "$color10" {
    const ratio = getRatio(count);
    if (ratio > 0.6) return "$accent10";
    if (ratio > 0.25) return "$color11";
    return "$color10";
  }

  return (
    <XStack
      flexWrap="wrap"
      gap="$2"
      padding="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color3"
      borderRadius={RADIUS_LG}
      justifyContent="center"
      alignItems="center"
      accessibilityLabel="Word cloud showing your most-used book descriptions"
    >
      {wordFrequencies.map(({ word, count }) => (
        <Text
          key={word}
          fontSize={getFontSize(count)}
          fontWeight={getFontWeight(count)}
          color={getColor(count)}
          opacity={getOpacity(count)}
          paddingHorizontal="$1"
        >
          {word}
        </Text>
      ))}
    </XStack>
  );
}
