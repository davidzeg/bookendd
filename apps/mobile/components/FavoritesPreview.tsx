import { ScrollView, Text, YStack } from "tamagui";
import { useRouter } from "expo-router";
import { Heart } from "@tamagui/lucide-icons";
import { EmptyState } from "./ui/EmptyState";
import { BookCover } from "./ui/BookCover";
import { COVER } from "./ui/tokens";

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
      alignItems="center"
      gap="$2"
    >
      <BookCover
        uri={book.coverUrl}
        size="shelf"
        onPress={handlePress}
        accessibilityLabel={`${book.title} by ${book.author ?? "unknown author"}`}
      />
      <Text
        fontSize="$2"
        fontWeight="500"
        color="$color11"
        numberOfLines={1}
        textAlign="center"
        width={COVER.shelf.w}
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
        icon={<Heart size={40} color="$color8" />}
      />
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 16,
        paddingHorizontal: 4,
      }}
    >
      {favorites.map((fav) => (
        <CoverTile key={fav.id} book={fav.book} />
      ))}
    </ScrollView>
  );
}
