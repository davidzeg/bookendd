import { ScrollView } from "react-native";
import { Image, Text, XStack, YStack, Theme } from "tamagui";
import { useRouter } from "expo-router";
import { StarDisplay } from "@/components/ui/StarDisplay";
import { EmptyState } from "@/components/ui/EmptyState";

const PLACEHOLDER_COVER =
  "https://placehold.co/80x120/1a1a2e/666666?text=No+Cover";

const COVER_HEIGHT = 120;
const COVER_WIDTH = Math.round(COVER_HEIGHT * (2 / 3)); // 2:3 aspect ratio
const ITEM_GAP = 12;
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
          fontWeight="600"
          color={"$accent10"}
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
    <Text fontSize={STAR_SIZE} fontWeight="600" color={"$accent10"}>
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
    >
      <YStack gap="$2" alignItems="center">
        <YStack
          borderRadius="$3"
          overflow="hidden"
          shadowColor="$color1"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={8}
        >
          <Image
            src={log.book.coverUrl ?? PLACEHOLDER_COVER}
            width={COVER_WIDTH}
            height={COVER_HEIGHT}
            backgroundColor="$color3"
          />
        </YStack>
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
      />
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 4,
        gap: ITEM_GAP,
      }}
    >
      {logs.map((log) => (
        <ActivityItem key={log.id} log={log} />
      ))}
    </ScrollView>
  );
}
