import { Avatar, ScrollView, Text, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { Button } from "@/components/ui/Button";
import { FavoritesPreview } from "@/components/FavoritesPreview";
import { WordCloud } from "@/components/WordCloud";
import { RecentActivity } from "@/components/RecentActivity";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatPill } from "@/components/ui/StatPill";
import { RefreshControl } from "react-native";

type ProfileData = {
  user: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    bio: string | null;
  };
  topBooks: Array<{
    id: string;
    position: number;
    book: {
      id: string;
      title: string;
      author: string | null;
      coverUrl: string | null;
    };
  }>;
  recentLogs: Array<{
    id: string;
    status: "FINISHED" | "DNF";
    rating: number | null;
    word: string | null;
    book: {
      id: string;
      title: string;
      coverUrl: string | null;
    };
  }>;
  words: Array<{
    word: string;
    count: number;
  }>;
};

interface ProfileViewProps {
  data: ProfileData;
  isOwnProfile: boolean;
  showBackButton?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ProfileView({
  data,
  isOwnProfile,
  showBackButton = false,
  onRefresh,
  isRefreshing = false,
}: ProfileViewProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { user, topBooks, recentLogs, words } = data;
  const displayName = user.name || user.username;
  const initial = displayName.charAt(0).toUpperCase();

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
    <ScrollView
      flex={1}
      backgroundColor="$background"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 16,
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      <YStack gap="$8">
        {/* Header */}
        {showBackButton && (
          <XStack alignItems="center" gap="$3">
            <Button size="$3" circular chromeless onPress={() => router.back()}>
              <ArrowLeft size={24} color="$color12" />
            </Button>
            <Text fontSize="$5" fontWeight="600" color="$color12">
              Profile
            </Text>
          </XStack>
        )}

        <YStack gap="$4">
          <XStack gap="$4" alignItems="center">
            <Avatar circular size={96} borderWidth={3} borderColor="$accent6">
              {user.avatarUrl ? (
                <Avatar.Image src={user.avatarUrl} />
              ) : (
                <Avatar.Fallback
                  backgroundColor="$accent5"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="$accent12" fontSize="$8" fontWeight="700">
                    {initial}
                  </Text>
                </Avatar.Fallback>
              )}
            </Avatar>
            <YStack flex={1} gap="$1">
              <Text
                fontSize="$8"
                fontWeight="700"
                color="$color12"
                style={{ letterSpacing: -0.5 }}
              >
                {displayName}
              </Text>
              {user.username && user.name && (
                <Text fontSize="$4" fontWeight="500" color="$color11">
                  @{user.username}
                </Text>
              )}
            </YStack>
          </XStack>

          {user.bio && (
            <Text fontSize="$4" color="$color11" lineHeight="$5">
              {user.bio}
            </Text>
          )}

          <XStack gap="$3" flexWrap="wrap">
            <StatPill value={stats.booksRead} label="books" />
            {stats.avgRating !== null && (
              <StatPill value={stats.avgRating.toFixed(1)} label="avg rating" />
            )}
          </XStack>

          {isOwnProfile && (
            <Button
              size="$3"
              variant="outlined"
              borderColor="$color6"
              onPress={() => router.push("/edit-profile")}
            >
              <Text color="$color11" fontWeight="500">
                Edit Profile
              </Text>
            </Button>
          )}
        </YStack>

        <YStack gap="$4">
          <SectionHeader
            title="Favorite Books"
            actionLabel={isOwnProfile ? "Edit" : undefined}
            onAction={
              isOwnProfile ? () => router.push("/edit-favorites") : undefined
            }
          />
          <FavoritesPreview favorites={topBooks} />
        </YStack>

        <YStack gap="$4">
          <SectionHeader title="Word Cloud" />
          <WordCloud aggregatedWords={words} minWords={1} />
        </YStack>

        <YStack gap="$4">
          <SectionHeader title="Recent Activity" />
          <RecentActivity logs={recentLogs} />
        </YStack>
      </YStack>
    </ScrollView>
  );
}
