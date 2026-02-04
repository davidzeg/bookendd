import { useMemo } from "react";
import { FavoritesPreview } from "@/components/FavoritesPreview";
import { ProfileHeader } from "@/components/ProfileHeader";
import { RecentActivity } from "@/components/RecentActivity";
import { WordCloud } from "@/components/WordCloud";
import { SectionHeader } from "@/components/ui/SectionHeader";
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

  const user = userQuery.data;
  const topBooks = topBooksQuery.data ?? [];
  const logs = logsQuery.data ?? [];

  // Calculate stats from logs
  const stats = useMemo(() => {
    const finishedLogs = logs.filter((log) => log.status === "FINISHED");
    const booksRead = finishedLogs.length;
    const ratingsSum = finishedLogs.reduce(
      (sum, log) => sum + (log.rating ?? 0),
      0,
    );
    const avgRating =
      booksRead > 0 ? Math.round((ratingsSum / booksRead) * 10) / 10 : null;

    return { booksRead, avgRating };
  }, [logs]);

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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "transparent" }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 16,
      }}
    >
      <YStack gap="$8">
        <ProfileHeader
          name={user?.name ?? null}
          username={user?.username ?? null}
          bio={user?.bio ?? null}
          avatarUrl={user?.avatarUrl ?? null}
          stats={stats}
        />

        <YStack gap="$4">
          <SectionHeader title="Favorite Books" />
          <FavoritesPreview
            favorites={topBooks}
            onSeeAll={() => {
              console.log("See all favorites");
            }}
          />
        </YStack>

        <YStack gap="$4">
          <SectionHeader title="Word Cloud" />
          <WordCloud words={logs.map((log) => log.word)} minWords={1} />
        </YStack>

        <YStack gap="$4">
          <SectionHeader title="Recent Activity" />
          <RecentActivity logs={logs} />
        </YStack>
      </YStack>
    </ScrollView>
  );
}
