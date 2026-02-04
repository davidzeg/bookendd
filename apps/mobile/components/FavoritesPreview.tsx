import { Image, Text, XStack, YStack } from "tamagui";
import { Button } from "./ui/Button";
import { EmptyState } from "./ui/EmptyState";

const PLACEHOLDER_COVER =
  "https://placehold.co/120x180/1a1a2e/666666?text=No+Cover";

type FavoriteBook = {
  id: string;
  position: number;
  book: {
    id: string;
    title: string;
    author: string | null;
    coverUrl: string | null;
  };
};

interface FavoritesPreviewProps {
  favorites: FavoriteBook[];
  onSeeAll?: () => void;
}

function CoverTile({ book }: { book: FavoriteBook["book"] }) {
  return (
    <YStack flex={1} alignItems="center" gap="$2">
      <Image
        src={book.coverUrl ?? PLACEHOLDER_COVER}
        width={80}
        height={120}
        borderRadius="$3"
        backgroundColor="$color3"
      />
      <Text
        fontSize="$2"
        color="$color11"
        numberOfLines={1}
        textAlign="center"
        width={80}
      >
        {book.title}
      </Text>
    </YStack>
  );
}

export function FavoritesPreview({
  favorites,
  onSeeAll,
}: FavoritesPreviewProps) {
  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Rate books 5 or 6 stars and they'll appear here"
      />
    );
  }

  const displayBooks = favorites.slice(0, 4);
  const totalCount = favorites.length;
  const hasMore = totalCount > 4;

  const topRow = displayBooks.slice(0, 2);
  const bottomRow = displayBooks.slice(2, 4);

  return (
    <YStack gap="$4">
      <YStack gap="$4" padding="$3" backgroundColor="$color2" borderRadius="$4">
        <XStack gap="$3" justifyContent="center">
          {topRow.map((fav) => (
            <CoverTile key={fav.id} book={fav.book} />
          ))}
        </XStack>

        {bottomRow.length > 0 && (
          <XStack gap="$3" justifyContent="center">
            {bottomRow.map((fav) => (
              <CoverTile key={fav.id} book={fav.book} />
            ))}
          </XStack>
        )}

        {hasMore && onSeeAll && (
          <Button size="$3" variant="outlined" onPress={onSeeAll}>
            <Button.Text>See all ({totalCount})</Button.Text>
          </Button>
        )}
      </YStack>
    </YStack>
  );
}
