import { useCallback, useRef, useState } from "react";
import { FlatList, StyleSheet, TextInput } from "react-native";
import { Input, TamaguiElement, Text, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft, X } from "@tamagui/lucide-icons";
import { trpc } from "@/lib/trpc";
import { useDebounce } from "@/lib/use-debounce";
import { BookCard } from "@/components/BookCard";
import { BookCardSkeleton } from "@/components/BookCardSkeleton";
import { Button } from "@/components/ui/Button";
import { GlassContainer } from "@/components/ui/GlassContainer";

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

  const showInitial = !debouncedQuery;
  const showLoading = searchQuery.isLoading && !searchQuery.data;
  const showEmpty = searchQuery.data?.length === 0;
  const showResults = searchQuery.data && searchQuery.data.length > 0;
  const showError = searchQuery.isError;

  return (
    <YStack flex={1} backgroundColor="$background">
      <GlassContainer
        style={[styles.header, { paddingTop: insets.top + 8 }]}
        borderRadius={0}
      >
        <XStack
          alignItems="center"
          gap="$3"
          paddingHorizontal="$4"
          paddingBottom="$3"
        >
          <Button size="$3" circular chromeless onPress={() => router.back()}>
            <ArrowLeft size={24} color="$gray12" />
          </Button>

          <Input
            ref={inputRef}
            flex={1}
            value={query}
            onChangeText={setQuery}
            placeholder="Search for a book..."
            placeholderTextColor="$gray10"
            backgroundColor="$gray3"
            borderWidth={0}
            size="$4"
            autoCapitalize="none"
            returnKeyType="search"
          />

          {query.length > 0 && (
            <Button size="$3" circular chromeless onPress={() => setQuery("")}>
              <X size={20} color="$gray11" />
            </Button>
          )}
        </XStack>
      </GlassContainer>

      {showInitial && (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$6"
        >
          <Text fontSize="$5" color="$gray10" textAlign="center">
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
          <Text fontSize="$5" color="$red10" textAlign="center">
            Something went wrong
          </Text>
          <Text fontSize="$3" color="$gray10" textAlign="center" marginTop="$2">
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
          <Text fontSize="$5" color="$gray10" textAlign="center">
            No books found
          </Text>
          <Text fontSize="$3" color="$gray9" textAlign="center" marginTop="$2">
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
  header: {
    borderBottomWidth: 0,
  },
  listContent: {
    padding: 16,
  },
});
