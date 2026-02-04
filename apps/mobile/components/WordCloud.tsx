import { useMemo } from "react";
import { Text, XStack } from "tamagui";
import { EmptyState } from "./ui/EmptyState";

interface WordCloudProps {
  words: (string | null)[];
  minWords?: number;
}

type WordFrequency = {
  word: string;
  count: number;
};

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 32;

export function WordCloud({ words, minWords = 5 }: WordCloudProps) {
  const wordFrequencies = useMemo(() => {
    const counts = new Map<string, number>();

    for (const word of words) {
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
  }, [words]);

  const totalWords = words.filter(Boolean).length;

  if (totalWords < minWords) {
    const remaining = minWords - totalWords;
    return (
      <EmptyState
        title="Not enough words yet"
        description={`Log ${remaining} more book${remaining !== 1 ? "s" : ""} with descriptors`}
      />
    );
  }

  const maxCount = wordFrequencies[0]?.count || 1;
  const minCount = wordFrequencies[wordFrequencies.length - 1]?.count || 1;

  function getFontSize(count: number): number {
    if (maxCount === minCount) return (MIN_FONT_SIZE + MAX_FONT_SIZE) / 2;
    const ratio = (count - minCount) / (maxCount - minCount);
    return Math.round(MIN_FONT_SIZE + ratio * (MAX_FONT_SIZE - MIN_FONT_SIZE));
  }

  function getFontWeight(count: number): "400" | "500" | "600" | "700" {
    if (maxCount === minCount) return "500";
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.75) return "700";
    if (ratio > 0.5) return "600";
    if (ratio > 0.25) return "500";
    return "400";
  }

  // Per DESIGN_SYSTEM.md: opacity ranges 0.55-1.0 based on frequency
  function getOpacity(count: number): number {
    if (maxCount === minCount) return 0.8;
    const ratio = (count - minCount) / (maxCount - minCount);
    return 0.55 + ratio * 0.45;
  }

  return (
    <XStack
      flexWrap="wrap"
      gap="$2"
      padding="$4"
      backgroundColor="$color2"
      borderRadius="$4"
      justifyContent="center"
      alignItems="center"
    >
      {wordFrequencies.map(({ word, count }) => (
        <Text
          key={word}
          fontSize={getFontSize(count)}
          fontWeight={getFontWeight(count)}
          color="$color11"
          opacity={getOpacity(count)}
          paddingHorizontal="$1"
        >
          {word}
        </Text>
      ))}
    </XStack>
  );
}
