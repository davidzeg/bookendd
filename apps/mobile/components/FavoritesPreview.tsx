import { Image, ScrollView, Text, YStack } from "tamagui";
import { useRouter } from "expo-router";
import { EmptyState } from "./ui/EmptyState";

const PLACEHOLDER_COVER =
  "https://placehold.co/120x180/1a1a2e/666666?text=No+Cover";

type FavoriteBook = {
  id: string;
  position: number;
  book: {
    id: string;
    openLibraryId: string;
    title: string;
    author: string | null;
    coverUrl: string | null;
  };
};

interface FavoritesPreviewProps {
  favorites: FavoriteBook[];
}

function CoverTile({ book }: { book: FavoriteBook["book"] }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/book/[openLibraryId]",
      params: {
        openLibraryId: book.openLibraryId,
        title: book.title,
        author: book.author ?? "",
        coverUrl: book.coverUrl ?? "",
        year: "",
      },
    });
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      gap="$2"
      onPress={handlePress}
      pressStyle={{ opacity: 0.7, scale: 0.97 }}
      accessibilityLabel={`${book.title} by ${book.author ?? "unknown author"}`}
      accessibilityRole="button"
    >
      <YStack borderRadius="$3" overflow="hidden">
        <Image
          src={book.coverUrl ?? PLACEHOLDER_COVER}
          width={80}
          height={120}
          backgroundColor="$color3"
        />
      </YStack>
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

export function FavoritesPreview({ favorites }: FavoritesPreviewProps) {
  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Rate books 5 or 6 stars and they'll appear here"
      />
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 12,
        paddingHorizontal: 4,
      }}
    >
      {favorites.map((fav) => (
        <CoverTile key={fav.id} book={fav.book} />
      ))}
    </ScrollView>
  );
}
