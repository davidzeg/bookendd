import { FavoritesPreview } from "@/components/FavoritesPreview";
import { RecentActivity } from "@/components/RecentActivity";
import { WordCloud } from "@/components/WordCloud";
import { trpc } from "@/lib/trpc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, Spinner, Text, Theme, YStack } from "tamagui";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const userQuery = trpc.user.me.useQuery();
  const topBooksQuery = trpc.user.topBooksMine.useQuery();
  const logsQuery = trpc.log.listMine.useQuery();

  const isLoading =
    userQuery.isLoading || topBooksQuery.isLoading || logsQuery.isLoading;
  const isError =
    userQuery.isError || topBooksQuery.isError || logsQuery.isError;

  if (isLoading) {
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

  if (isError) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
        padding="$6"
      >
        <Theme name="error">
          <Text fontSize="$5" textAlign="center">
            Something went wrong
          </Text>
        </Theme>
        <Text fontSize="$3" color="$color11" textAlign="center" marginTop="$2">
          Pull down to refresh
        </Text>
      </YStack>
    );
  }

  const user = userQuery.data;
  const topBooks = topBooksQuery.data ?? [];
  const logs = logsQuery.data ?? [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "transparent" }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 16,
      }}
    >
      <YStack gap="$6">
        <YStack gap="$2">
          <Text fontSize="$8" fontWeight="bold" color="$color12">
            {user?.name || user?.username || "Profile"}
          </Text>
          {user?.username && user?.name && (
            <Text fontSize="$4" color="$color11">
              @{user.username}
            </Text>
          )}
          {user?.bio && (
            <Text fontSize="$4" color="$color11" marginTop="$1">
              {user.bio}
            </Text>
          )}
        </YStack>

        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            Favorite Books
          </Text>
          <FavoritesPreview
            favorites={topBooks}
            onSeeAll={() => {
              console.log("See all favorites");
            }}
          />
        </YStack>

        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            Word Cloud
          </Text>
          <WordCloud words={logs.map((log) => log.word)} minWords={1} />
        </YStack>

        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            Recent Activity
          </Text>
          <RecentActivity logs={logs} />
        </YStack>
      </YStack>
    </ScrollView>
  );
}
