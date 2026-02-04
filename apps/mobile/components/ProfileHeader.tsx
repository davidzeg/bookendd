import { Avatar, Text, XStack, YStack } from "tamagui";
import { StatPill } from "./ui/StatPill";

interface ProfileHeaderProps {
  name: string | null;
  username: string | null;
  bio: string | null;
  avatarUrl?: string | null;
  stats: {
    booksRead: number;
    avgRating: number | null;
  };
}

/**
 * Profile header with avatar, name, username, bio, and stats row
 * Per DESIGN_SYSTEM.md: Avatar size 96, border, display name $8/700
 */
export function ProfileHeader({
  name,
  username,
  bio,
  avatarUrl,
  stats,
}: ProfileHeaderProps) {
  const displayName = name || username || "Profile";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <YStack gap="$4">
      {/* Avatar and Name Row */}
      <XStack gap="$4" alignItems="center">
        <Avatar circular size={96} borderWidth={3} borderColor="$accent6">
          {avatarUrl ? (
            <Avatar.Image src={avatarUrl} />
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
          {username && name && (
            <Text fontSize="$4" fontWeight="500" color="$color11">
              @{username}
            </Text>
          )}
        </YStack>
      </XStack>

      {/* Bio */}
      {bio && (
        <Text fontSize="$4" color="$color11" lineHeight="$5">
          {bio}
        </Text>
      )}

      {/* Stats Row */}
      <XStack gap="$3" flexWrap="wrap">
        <StatPill value={stats.booksRead} label="books" />
        {stats.avgRating !== null && (
          <StatPill value={stats.avgRating.toFixed(1)} label="avg rating" />
        )}
      </XStack>
    </YStack>
  );
}
