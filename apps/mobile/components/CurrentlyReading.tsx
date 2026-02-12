import { ScrollView } from "react-native";
import { Text, YStack } from "tamagui";
import { useRouter } from "expo-router";
import { BookCover } from "@/components/ui/BookCover";
import { COVER } from "@/components/ui/tokens";

type ReadingBook = {
  id: string;
  book: {
    id: string;
    openLibraryId: string;
    title: string;
    author: string | null;
    coverUrl: string | null;
  };
};

interface CurrentlyReadingProps {
  logs: ReadingBook[];
}

function ReadingCover({ log }: { log: ReadingBook }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/book/[openLibraryId]",
      params: {
        openLibraryId: log.book.openLibraryId,
        title: log.book.title,
        author: log.book.author ?? "",
        coverUrl: log.book.coverUrl ?? "",
        year: "",
      },
    });
  };

  return (
    <YStack alignItems="center" gap="$2">
      <BookCover
        uri={log.book.coverUrl}
        size="shelf"
        onPress={handlePress}
        accessibilityLabel={`Currently reading ${log.book.title}`}
      />
      <Text
        fontSize="$2"
        fontWeight="500"
        color="$color11"
        numberOfLines={1}
        textAlign="center"
        width={COVER.shelf.w}
      >
        {log.book.title}
      </Text>
    </YStack>
  );
}

export function CurrentlyReading({ logs }: CurrentlyReadingProps) {
  if (logs.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 4,
        gap: 16,
      }}
    >
      {logs.map((log) => (
        <ReadingCover key={log.id} log={log} />
      ))}
    </ScrollView>
  );
}
