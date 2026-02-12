import { ScrollView } from "react-native";
import { Text, XStack, YStack, Theme } from "tamagui";
import { useRouter } from "expo-router";
import { BookOpen } from "@tamagui/lucide-icons";
import { StarDisplay } from "@/components/ui/StarDisplay";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookCover } from "@/components/ui/BookCover";
import { COVER } from "@/components/ui/tokens";

const COVER_HEIGHT = COVER.shelf.h;
const STAR_SIZE = Math.round(COVER_HEIGHT / 10);
const LETTER_SIZE = Math.round(COVER_HEIGHT / 9);
const LETTER_LINE_HEIGHT = Math.round(LETTER_SIZE * 1.1);

type LogWithBook = {
  id: string;
  status: "FINISHED" | "DNF" | "READING";
  rating: number | null;
  word: string | null;
  book: {
    id: string;
    openLibraryId: string;
    title: string;
    author: string | null;
    coverUrl: string | null;
  };
};

interface RecentActivityProps {
  logs: LogWithBook[];
}

function VerticalWord({ word }: { word: string }) {
  const displayWord = word.length > 8 ? word.slice(0, 8) : word;

  return (
    <YStack
      height={COVER_HEIGHT}
      alignItems="center"
      justifyContent="center"
      gap={-2}
    >
      {displayWord.split("").map((letter, index) => (
        <Text
          key={index}
          fontSize={LETTER_SIZE}
          fontWeight="700"
          color="$accent9"
          lineHeight={LETTER_LINE_HEIGHT}
        >
          {letter.toUpperCase()}
        </Text>
      ))}
    </YStack>
  );
}

function DnfBadge() {
  return (
    <Theme name="error">
      <DnfText />
    </Theme>
  );
}

function DnfText() {
  return (
    <Text fontSize={STAR_SIZE} fontWeight="600" color="$accent10">
      DNF
    </Text>
  );
}

function ActivityItem({ log }: { log: LogWithBook }) {
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
    <XStack
      gap={4}
      alignItems="flex-start"
      onPress={handlePress}
      pressStyle={{ opacity: 0.7, scale: 0.97 }}
      accessibilityLabel={`${log.book.title}${log.word ? `, described as ${log.word}` : ""}`}
      accessibilityRole="button"
    >
      <YStack gap="$2" alignItems="center">
        <BookCover uri={log.book.coverUrl} size="shelf" />
        <YStack height={STAR_SIZE} justifyContent="center" alignItems="center">
          {log.status === "FINISHED" && log.rating ? (
            <StarDisplay rating={log.rating} size={STAR_SIZE} />
          ) : (
            <DnfBadge />
          )}
        </YStack>
      </YStack>

      {log.word && <VerticalWord word={log.word} />}
    </XStack>
  );
}

export function RecentActivity({ logs }: RecentActivityProps) {
  if (logs.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Search for a book to log your first read"
        icon={<BookOpen size={40} color="$color8" />}
      />
    );
  }

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
        <ActivityItem key={log.id} log={log} />
      ))}
    </ScrollView>
  );
}
