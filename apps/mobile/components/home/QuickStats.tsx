import { XStack, Theme, useTheme } from "tamagui";
import { BookOpen, Star } from "@tamagui/lucide-icons";
import { StatPill } from "@/components/ui/StatPill";

interface QuickStatsProps {
  booksRead: number;
  avgRating: number | null;
}

export function QuickStats({ booksRead, avgRating }: QuickStatsProps) {
  const theme = useTheme();
  return (
    <XStack gap="$3" flexWrap="wrap">
      <StatPill
        value={booksRead}
        label={booksRead === 1 ? "book" : "books"}
        icon={<BookOpen size={16} color="$accent10" />}
      />
      {avgRating !== null && (
        <Theme name="star">
          <StatPill
            value={avgRating.toFixed(1)}
            label="avg"
            icon={
              <Star size={16} color="$accent10" fill={theme.accent10.get()} />
            }
          />
        </Theme>
      )}
    </XStack>
  );
}
