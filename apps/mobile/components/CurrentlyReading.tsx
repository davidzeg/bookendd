import { ScrollView } from "react-native";
import { Image, Text, YStack } from "tamagui";
import { useRouter } from "expo-router";

const PLACEHOLDER_COVER =
  "https://placehold.co/80x120/1a1a2e/666666?text=No+Cover";

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
    <YStack
      alignItems="center"
      gap="$2"
      onPress={handlePress}
      pressStyle={{ opacity: 0.7, scale: 0.97 }}
    >
      <YStack
        borderRadius={8}
        overflow="hidden"
        shadowColor="$color1"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={8}
      >
        <Image
          src={log.book.coverUrl ?? PLACEHOLDER_COVER}
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
        gap: 12,
      }}
    >
      {logs.map((log) => (
        <ReadingCover key={log.id} log={log} />
      ))}
    </ScrollView>
  );
}
