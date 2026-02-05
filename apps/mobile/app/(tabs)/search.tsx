import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Input, TamaguiElement, Text, Theme, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft, X } from "@tamagui/lucide-icons";
import { trpc } from "@/lib/trpc";
import { useDebounce } from "@/lib/use-debounce";
import { BookCard } from "@/components/BookCard";
import { BookCardSkeleton } from "@/components/BookCardSkeleton";
import { Button } from "@/components/ui/Button";
import { analytics } from "@/lib/posthog";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 300);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const inputRef = useRef<TamaguiElement>(null);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }, []),
  );

  const searchQuery = trpc.book.search.useQuery(
    { query: debouncedQuery, limit: 15 },
    { enabled: debouncedQuery.length > 0 },
  );

  useEffect(() => {
    if (searchQuery.data && debouncedQuery) {
      analytics.bookSearched(debouncedQuery, searchQuery.data.length);
    }
  }, [searchQuery.data, debouncedQuery]);

  const showInitial = !debouncedQuery;
  const showLoading = searchQuery.isLoading && !searchQuery.data;
  const showEmpty = searchQuery.data?.length === 0;
  const showResults = searchQuery.data && searchQuery.data.length > 0;
  const showError = searchQuery.isError;

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack
        paddingTop={insets.top + 8}
        paddingHorizontal="$4"
        paddingBottom="$3"
      >
        <XStack alignItems="center" gap="$3" paddingVertical="$2">
          <Button
            size="$3"
            circular
            chromeless
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color="$color12" />
          </Button>

          <Input
            ref={inputRef}
            flex={1}
            value={query}
            onChangeText={setQuery}
            placeholder="Search for a book..."
            size="$4"
            autoCapitalize="none"
            returnKeyType="search"
            backgroundColor="$color2"
            borderColor="$color4"
            borderWidth={1}
            color="$color12"
            placeholderTextColor="$color9"
            accessibilityLabel="Search for a book"
            accessibilityHint="Enter a title, author, or ISBN"
          />

          {query.length > 0 && (
            <Button
              size="$3"
              circular
              chromeless
              onPress={() => setQuery("")}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <X size={20} color="$color11" />
            </Button>
          )}
        </XStack>
      </YStack>

      {showInitial && (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$6"
        >
          <Text fontSize="$5" color="$color11" textAlign="center">
            Search by title, author, or ISBN
          </Text>
        </YStack>
      )}

      {showLoading && (
        <YStack padding="$4" gap="$3">
          {[1, 2, 3, 4, 5].map((i) => (
            <BookCardSkeleton key={i} />
          ))}
        </YStack>
      )}

      {showError && (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$6"
        >
          <Theme name="error">
            <Text fontSize="$5" color="$color" textAlign="center">
              Something went wrong
            </Text>
          </Theme>
          <Text
            fontSize="$3"
            color="$color11"
            textAlign="center"
            marginTop="$2"
          >
            {searchQuery.error?.message ?? "Please try again"}
          </Text>
        </YStack>
      )}

      {showEmpty && (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$6"
        >
          <Text fontSize="$5" color="$color11" textAlign="center">
            No books found
          </Text>
          <Text
            fontSize="$3"
            color="$color10"
            textAlign="center"
            marginTop="$2"
          >
            Try a different search term
          </Text>
        </YStack>
      )}

      {showResults && (
        <FlatList
          data={searchQuery.data}
          keyExtractor={(item) => item.openLibraryId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <YStack height={12} />}
          removeClippedSubviews
          initialNumToRender={8}
          maxToRenderPerBatch={5}
          windowSize={5}
          renderItem={({ item }) => (
            <BookCard
              title={item.title}
              author={item.author}
              coverUrl={item.coverUrl}
              year={item.firstPublishYear}
              onPress={() => {
                router.push({
                  pathname: "/log-book",
                  params: {
                    openLibraryId: item.openLibraryId,
                    title: item.title,
                    author: item.author ?? "",
                    coverUrl: item.coverUrl ?? "",
                    year: item.firstPublishYear?.toString() ?? "",
                  },
                });
              }}
            />
          )}
        />
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
});
