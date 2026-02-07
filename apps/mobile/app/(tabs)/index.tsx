import { ScrollView, Text, YStack, Theme } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RefreshControl } from "react-native";
import { trpc } from "@/lib/trpc";
import {
  GreetingHeader,
  QuickStats,
  LastReadCard,
  SearchCTA,
  HomeScreenSkeleton,
} from "@/components/home";
import { EmptyState } from "@/components/ui/EmptyState";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const profileQuery = trpc.user.myProfile.useQuery();

  if (profileQuery.isLoading) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingTop={insets.top + 16}
      >
        <HomeScreenSkeleton />
      </YStack>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
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

  const { user, recentLogs } = profileQuery.data;
  const lastLog = recentLogs[0];

  const stats = {
    booksRead: recentLogs.filter((log) => log.status === "FINISHED").length,
    avgRating: (() => {
      const finished = recentLogs.filter(
        (log) => log.status === "FINISHED" && log.rating,
      );
      if (finished.length === 0) return null;
      const sum = finished.reduce((acc, log) => acc + (log.rating ?? 0), 0);
      return Math.round((sum / finished.length) * 10) / 10;
    })(),
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <ScrollView
        flex={1}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
        refreshControl={
          <RefreshControl
            refreshing={profileQuery.isRefetching}
            onRefresh={() => profileQuery.refetch()}
          />
        }
      >
        <YStack gap="$6">
          <GreetingHeader name={user.name} />

          {stats.booksRead > 0 && (
            <QuickStats
              booksRead={stats.booksRead}
              avgRating={stats.avgRating}
            />
          )}

          <SearchCTA />

          {lastLog ? (
            <LastReadCard
              book={lastLog.book}
              status={lastLog.status}
              rating={lastLog.rating}
              word={lastLog.word}
            />
          ) : (
            <YStack gap="$3">
              <Text fontSize="$3" color="$color10" fontWeight="500">
                Your reading journey
              </Text>
              <EmptyState
                title="No books yet"
                description="Search for a book and log your first read!"
                minHeight={120}
              />
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
