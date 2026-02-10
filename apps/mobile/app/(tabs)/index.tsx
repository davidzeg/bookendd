import { ScrollView, Text, YStack, Theme } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RefreshControl } from "react-native";
import { trpc } from "@/lib/trpc";
import {
  GreetingHeader,
  SearchCTA,
  HomeScreenSkeleton,
  FeedCard,
} from "@/components/home";
import { CurrentlyReading } from "@/components/CurrentlyReading";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const profileQuery = trpc.user.myProfile.useQuery();
  const feedQuery = trpc.log.globalFeed.useQuery();

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
          {profileQuery.error?.message ?? "Could not load your data"}
        </Text>
        <Button
          marginTop="$2"
          size="$3"
          variant="outlined"
          onPress={() => profileQuery.refetch()}
        >
          <Button.Text>Retry</Button.Text>
        </Button>
      </YStack>
    );
  }

  const { user, recentLogs } = profileQuery.data;
  const currentlyReading = recentLogs.filter((log) => log.status === "READING");

  const handleRefresh = () => {
    profileQuery.refetch();
    feedQuery.refetch();
  };

  const isRefreshing = profileQuery.isRefetching || feedQuery.isRefetching;

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <ScrollView
        flex={1}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 16,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <YStack gap="$6">
          {/* A. Greeting Header */}
          <GreetingHeader name={user.name} />

          {/* B. Currently Reading Shelf */}
          {currentlyReading.length > 0 && (
            <YStack gap="$3">
              <SectionHeader title="Currently Reading" />
              <CurrentlyReading logs={currentlyReading} />
            </YStack>
          )}

          {/* C. Search CTA */}
          <SearchCTA />

          {/* D. Global Activity Feed */}
          <YStack gap="$3">
            <SectionHeader title="Recent on Antilogos" />

            {feedQuery.isLoading && (
              <YStack gap="$3">
                {[1, 2, 3].map((i) => (
                  <YStack
                    key={i}
                    backgroundColor="$color2"
                    borderRadius={12}
                    padding="$3"
                    height={120}
                    opacity={0.5}
                  />
                ))}
              </YStack>
            )}

            {feedQuery.isError && (
              <YStack
                padding="$4"
                borderRadius={12}
                backgroundColor="$color2"
                alignItems="center"
                gap="$2"
              >
                <Text fontSize="$3" color="$color10" textAlign="center">
                  Could not load activity feed
                </Text>
                <Button
                  size="$3"
                  variant="outlined"
                  onPress={() => feedQuery.refetch()}
                >
                  <Button.Text>Retry</Button.Text>
                </Button>
              </YStack>
            )}

            {feedQuery.data && feedQuery.data.length === 0 && (
              <EmptyState
                title="No activity yet"
                description="Be the first to log a book!"
                minHeight={100}
              />
            )}

            {feedQuery.data &&
              feedQuery.data.length > 0 &&
              feedQuery.data.map((item) => (
                <FeedCard key={item.id} item={item} />
              ))}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
