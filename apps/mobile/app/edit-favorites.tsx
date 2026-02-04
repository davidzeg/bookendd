import { SectionHeader } from "@/components/ui/SectionHeader";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, Spinner, Text, XStack, YStack, Image } from "tamagui";

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

export default function EditFavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const utils = trpc.useUtils();

  const topBooksQuery = trpc.user.topBooksMine.useQuery();
  const setFavoritesMutation = trpc.user.setFavorites.useMutation({
    onSuccess: () => {
      utils.user.topBooksMine.invalidate();
      router.back();
    },
  });

  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (topBooksQuery.data && !hasInitialized) {
      setFavorites(topBooksQuery.data.books);
      setHasInitialized(true);
    }
  }, [topBooksQuery.data, hasInitialized]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFavorites = [...favorites];
    [newFavorites[index - 1], newFavorites[index]] = [
      newFavorites[index],
      newFavorites[index - 1],
    ];
    setFavorites(newFavorites.map((f, i) => ({ ...f, position: i + 1 })));
  };

  const moveDown = (index: number) => {
    if (index === favorites.length - 1) return;
    const newFavorites = [...favorites];
    [newFavorites[index], newFavorites[index + 1]] = [
      newFavorites[index + 1],
      newFavorites[index],
    ];
    setFavorites(newFavorites.map((f, i) => ({ ...f, position: i + 1 })));
  };

  const remove = (index: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((_, i) => i !== index);

      if (newFavorites.length === 0) {
        return [];
      }

      return newFavorites.map((f, i) => ({ ...f, position: i + 1 }));
    });
  };

  const handleSave = () => {
    setFavoritesMutation.mutate({
      favorites: favorites.map((f) => ({
        bookId: f.book.id,
        position: f.position,
      })),
    });
  };

  if (topBooksQuery.isLoading) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
      >
        <Spinner size="large" color="$accent10" />
      </YStack>
    );
  }

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top + 16}
      paddingBottom={insets.bottom}
    >
      <XStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$6"
        paddingHorizontal={16}
      >
        <Text
          fontSize="$3"
          color="$accent10"
          fontWeight="500"
          onPress={() => router.back()}
          pressStyle={{ opacity: 0.7 }}
        >
          Cancel
        </Text>
        <Text fontSize="$5" fontWeight="600" color="$color12">
          Edit Favorites
        </Text>
        <Text
          fontSize="$3"
          color={setFavoritesMutation.isPending ? "$color9" : "$accent10"}
          fontWeight="500"
          onPress={handleSave}
          pressStyle={{ opacity: 0.7 }}
        >
          {setFavoritesMutation.isPending ? "Saving..." : "Save"}
        </Text>
      </XStack>

      <ScrollView
        flex={1}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <YStack gap="$4">
          <SectionHeader title="Your Favorites" />
          {favorites.length === 0 ? (
            <YStack
              padding="$6"
              borderRadius="$4"
              alignItems="center"
              borderWidth={2}
              borderColor="$color4"
              style={{ borderStyle: "dashed" }}
            >
              <Text color="$color10" fontSize="$4" fontWeight="500">
                No favorites yet
              </Text>
              <Text
                fontSize="$3"
                color="$color9"
                marginTop="$2"
                textAlign="center"
              >
                Add books from your reads below
              </Text>
            </YStack>
          ) : (
            <YStack gap="$3">
              {favorites.map((fav, index) => (
                <XStack
                  key={fav.id}
                  backgroundColor="$color2"
                  borderRadius="$4"
                  padding="$3"
                  alignItems="center"
                  gap="$3"
                >
                  <Image
                    src={fav.book.coverUrl ?? PLACEHOLDER_COVER}
                    width={50}
                    height={75}
                    borderRadius="$2"
                    backgroundColor="$color3"
                  />

                  <YStack flex={1} gap="$1">
                    <Text
                      fontSize="$3"
                      fontWeight="500"
                      color="$color12"
                      numberOfLines={2}
                    >
                      {fav.book.title}
                    </Text>
                    {fav.book.author && (
                      <Text fontSize="$2" color="$color10" numberOfLines={1}>
                        {fav.book.author}
                      </Text>
                    )}
                  </YStack>

                  <YStack gap="$1">
                    <Text
                      fontSize="$4"
                      color={index === 0 ? "$color6" : "$color11"}
                      onPress={() => moveUp(index)}
                      pressStyle={{ opacity: 0.7 }}
                      padding="$1"
                    >
                      ↑
                    </Text>
                    <Text
                      fontSize="$4"
                      color={
                        index === favorites.length - 1 ? "$color6" : "$color11"
                      }
                      onPress={() => moveDown(index)}
                      pressStyle={{ opacity: 0.7 }}
                      padding="$1"
                    >
                      ↓
                    </Text>
                  </YStack>

                  <Text
                    fontSize="$4"
                    color="$color10"
                    onPress={() => remove(index)}
                    pressStyle={{ opacity: 0.7 }}
                    padding="$2"
                  >
                    ✕
                  </Text>
                </XStack>
              ))}
            </YStack>
          )}
        </YStack>
        {/* TODO: Add from logged books section */}
        {/* TODO: Quick add section */}
      </ScrollView>
    </YStack>
  );
}
