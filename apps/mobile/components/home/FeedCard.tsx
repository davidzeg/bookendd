import { Avatar, Image, Text, XStack, YStack, Theme } from "tamagui";
import { useRouter } from "expo-router";
import { StarDisplay } from "@/components/ui/StarDisplay";

const PLACEHOLDER_COVER =
  "https://placehold.co/48x72/1a1a2e/666666?text=No+Cover";

type FeedItem = {
  id: string;
  status: "FINISHED" | "DNF" | "READING";
  rating: number | null;
  word: string | null;
  createdAt: string;
  book: {
    openLibraryId: string;
    title: string;
    author: string | null;
    coverUrl: string | null;
  };
  user: {
    username: string;
    name: string | null;
    avatarUrl: string | null;
  };
};

interface FeedCardProps {
  item: FeedItem;
}

function formatTimeAgo(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(dateString).toLocaleDateString();
}

function getStatusText(status: string): string {
  switch (status) {
    case "READING":
      return "started reading";
    case "FINISHED":
      return "finished";
    case "DNF":
      return "did not finish";
    default:
      return "logged";
  }
}

export function FeedCard({ item }: FeedCardProps) {
  const router = useRouter();

  const handleBookPress = () => {
    router.push({
      pathname: "/book/[openLibraryId]",
      params: {
        openLibraryId: item.book.openLibraryId,
        title: item.book.title,
        author: item.book.author ?? "",
        coverUrl: item.book.coverUrl ?? "",
        year: "",
      },
    });
  };

  const handleUserPress = () => {
    router.push({
      pathname: "/user/[username]",
      params: { username: item.user.username },
    });
  };

  const initial = (item.user.name || item.user.username)
    .charAt(0)
    .toUpperCase();

  return (
    <YStack
      backgroundColor="$color2"
      borderRadius={12}
      padding="$3"
      gap="$3"
    >
      {/* User row */}
      <XStack
        gap="$2"
        alignItems="center"
        onPress={handleUserPress}
        pressStyle={{ opacity: 0.7 }}
        accessibilityLabel={`View ${item.user.name || item.user.username}'s profile`}
        accessibilityRole="button"
      >
        <Avatar circular size={32}>
          {item.user.avatarUrl ? (
            <Avatar.Image src={item.user.avatarUrl} />
          ) : (
            <Avatar.Fallback
              backgroundColor="$accent5"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="$accent12" fontSize="$2" fontWeight="700">
                {initial}
              </Text>
            </Avatar.Fallback>
          )}
        </Avatar>
        <Text fontSize="$3" fontWeight="600" color="$color12">
          {item.user.name || item.user.username}
        </Text>
        <Text fontSize="$2" color="$color9">
          {formatTimeAgo(item.createdAt)}
        </Text>
      </XStack>

      {/* Activity description + book */}
      <XStack
        gap="$3"
        alignItems="center"
        onPress={handleBookPress}
        pressStyle={{ opacity: 0.7, scale: 0.98 }}
        accessibilityLabel={`${item.book.title} by ${item.book.author ?? "unknown author"}`}
        accessibilityRole="button"
      >
        <YStack borderRadius={6} overflow="hidden">
          <Image
            src={item.book.coverUrl ?? PLACEHOLDER_COVER}
            width={48}
            height={72}
            backgroundColor="$color3"
          />
        </YStack>

        <YStack flex={1} gap="$1">
          <Text fontSize="$3" color="$color10">
            {getStatusText(item.status)}
          </Text>
          <Text
            fontSize="$4"
            fontWeight="600"
            color="$color12"
            numberOfLines={2}
          >
            {item.book.title}
          </Text>
          {item.book.author && (
            <Text fontSize="$2" color="$color10" numberOfLines={1}>
              {item.book.author}
            </Text>
          )}
          <XStack gap="$2" alignItems="center" marginTop="$1">
            {item.status === "FINISHED" && item.rating && (
              <StarDisplay rating={item.rating} size={12} />
            )}
            {item.word && (
              <Text fontSize="$2" color="$accent10" fontStyle="italic">
                "{item.word}"
              </Text>
            )}
          </XStack>
        </YStack>
      </XStack>
    </YStack>
  );
}
