import { XStack, Theme, useTheme } from "tamagui";
import { Star } from "@tamagui/lucide-icons";

interface StarDisplayProps {
  rating: number;
  size?: number;
}

export function StarDisplay({ rating, size = 12 }: StarDisplayProps) {
  return (
    <Theme name="star">
      <StarIcons rating={rating} size={size} />
    </Theme>
  );
}

function StarIcons({ rating, size }: StarDisplayProps) {
  const theme = useTheme();
  const starColor = theme.accent10.get();

  return (
    <XStack gap={2}>
      {Array.from({ length: rating }).map((_, index) => (
        <Star key={index} size={size} fill={starColor} color="$accent10" />
      ))}
    </XStack>
  );
}
