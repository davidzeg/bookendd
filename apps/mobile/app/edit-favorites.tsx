import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { analytics } from "@/lib/posthog";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spinner, Text, XStack, YStack, Image, Input } from "tamagui";

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
      analytics.favoritesUpdated(favorites.length);
      utils.user.topBooksMine.invalidate();
      router.back();
    },
  });
  const logsQuery = trpc.log.listMine.useQuery();

  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [quickAddSectionY, setQuickAddSectionY] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const topRef = useRef<View>(null);

  const candidateBooks = useMemo(() => {
    if (!logsQuery.data) return [];

    const favoriteBookIds = new Set(favorites.map((f) => f.book.id));

    return logsQuery.data
      .filter((log) => !favoriteBookIds.has(log.book.id))
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [logsQuery.data, favorites]);

  useEffect(() => {
    if (topBooksQuery.data && !hasInitialized) {
      setFavorites(topBooksQuery.data.books);
      setHasInitialized(true);
    }
  }, [topBooksQuery.data, hasInitialized]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchResults = trpc.book.search.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2 },
  );

  useEffect(() => {
    if (searchResults.data && searchResults.data.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: quickAddSectionY,
          animated: true,
        });
      }, 100);
    }
  }, [searchResults.data, quickAddSectionY]);

  const quickAddMutation = trpc.log.quickAdd.useMutation();

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

  const handleQuickAdd = async (book: {
    openLibraryId: string;
    title: string;
    author: string | null;
    coverUrl: string | null;
  }) => {
    try {
      const savedBook = await quickAddMutation.mutateAsync({
        openLibraryId: book.openLibraryId,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
      });

      const newPosition = favorites.length + 1;
      setFavorites([
        ...favorites,
        {
          id: `temp-${savedBook.id}`,
          position: newPosition,
          book: {
            id: savedBook.id,
            title: savedBook.title,
            author: savedBook.author,
            coverUrl: savedBook.coverUrl,
          },
        },
      ]);

      setSearchQuery("");

      Keyboard.dismiss();
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      }, 300);
    } catch (error) {
      console.error("Failed to quick add:", error);
    }
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

  const initialFavorites = topBooksQuery.data?.books ?? [];

  const hasChanges = useMemo(() => {
    if (favorites.length !== initialFavorites.length) return true;
    return favorites.some(
      (f, i) =>
        f.book.id !== initialFavorites[i]?.book.id ||
        f.position !== initialFavorites[i]?.position,
    );
  }, [favorites, initialFavorites]);

  const canSave = hasChanges && !setFavoritesMutation.isPending;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          <Button
            chromeless
            onPress={() => router.back()}
            disabled={setFavoritesMutation.isPending}
          >
            <Text color="$accent10">Cancel</Text>
          </Button>
          <Text fontSize="$6" fontWeight="700" color="$color12">
            Edit Favorites
          </Text>
          <Button
            chromeless
            onPress={handleSave}
            disabled={!canSave}
            width={80}
          >
            {setFavoritesMutation.isPending ? (
              <Spinner size="small" color="$accent10" />
            ) : (
              <Text color={canSave ? "$accent10" : "$color8"} fontWeight="600">
                Save
              </Text>
            )}
          </Button>
        </XStack>

        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View ref={topRef} />
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
                          index === favorites.length - 1
                            ? "$color6"
                            : "$color11"
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

          <YStack gap="$4" marginTop="$8">
            <SectionHeader title="Add from Your Books" />

            {candidateBooks.length === 0 ? (
              <Text color="$color10" fontSize="$3">
                No more books to add
              </Text>
            ) : (
              <YStack gap="$3">
                {candidateBooks.map((log) => (
                  <XStack
                    key={log.id}
                    backgroundColor="$color2"
                    borderRadius="$4"
                    padding="$3"
                    alignItems="center"
                    gap="$3"
                  >
                    <Image
                      src={log.book.coverUrl ?? PLACEHOLDER_COVER}
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
                        {log.book.title}
                      </Text>
                      {log.book.author && (
                        <Text fontSize="$2" color="$color10" numberOfLines={1}>
                          {log.book.author}
                        </Text>
                      )}
                    </YStack>

                    {log.rating && (
                      <Text fontSize="$2" color="$color10">
                        {"★".repeat(log.rating)}
                      </Text>
                    )}

                    <Text
                      fontSize="$5"
                      color="$accent10"
                      onPress={() => {
                        const newPosition = favorites.length + 1;
                        setFavorites([
                          ...favorites,
                          {
                            id: `temp-${log.book.id}`,
                            position: newPosition,
                            book: log.book,
                          },
                        ]);
                      }}
                      pressStyle={{ opacity: 0.7 }}
                      padding="$2"
                    >
                      +
                    </Text>
                  </XStack>
                ))}
              </YStack>
            )}
          </YStack>
          <View onLayout={(e) => setQuickAddSectionY(e.nativeEvent.layout.y)}>
            <YStack gap="$4" marginTop="$8">
              <SectionHeader title="Add Any Book" />

              <Input
                size="$4"
                placeholder="Search for a book..."
                backgroundColor="$color2"
                borderColor="$color4"
                borderWidth={1}
                color="$color12"
                placeholderTextColor="$color9"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              {searchResults.isLoading && debouncedQuery.length >= 2 && (
                <XStack justifyContent="center" padding="$4">
                  <Spinner size="small" color="$accent10" />
                </XStack>
              )}

              {searchResults.data && searchResults.data.length > 0 && (
                <YStack gap="$3">
                  {searchResults.data.map((book) => {
                    const isInFavorites = favorites.some(
                      (f) =>
                        f.book.id === book.openLibraryId ||
                        f.book.title === book.title, // fallback check
                    );

                    if (isInFavorites) return null;

                    return (
                      <XStack
                        key={book.openLibraryId}
                        backgroundColor="$color2"
                        borderRadius="$4"
                        padding="$3"
                        alignItems="center"
                        gap="$3"
                      >
                        <Image
                          src={book.coverUrl ?? PLACEHOLDER_COVER}
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
                            {book.title}
                          </Text>
                          {book.author && (
                            <Text
                              fontSize="$2"
                              color="$color10"
                              numberOfLines={1}
                            >
                              {book.author}
                            </Text>
                          )}
                        </YStack>

                        <Text
                          fontSize="$5"
                          color={
                            quickAddMutation.isPending ? "$color9" : "$accent10"
                          }
                          onPress={() =>
                            !quickAddMutation.isPending && handleQuickAdd(book)
                          }
                          pressStyle={{ opacity: 0.7 }}
                          padding="$2"
                        >
                          +
                        </Text>
                      </XStack>
                    );
                  })}
                </YStack>
              )}

              {searchResults.data &&
                searchResults.data.length === 0 &&
                debouncedQuery.length >= 2 && (
                  <Text color="$color10" fontSize="$3" textAlign="center">
                    No books found
                  </Text>
                )}
            </YStack>
          </View>
        </ScrollView>
      </YStack>
    </KeyboardAvoidingView>
  );
}
