import { Avatar, Text, XStack, YStack } from "tamagui";
import { StatPill } from "./ui/StatPill";
import { Button } from "./ui/Button";

interface ProfileHeaderProps {
  name: string | null;
  username: string | null;
  bio: string | null;
  avatarUrl?: string | null;
  stats: {
    booksRead: number;
    avgRating: number | null;
  };
  onEditPress?: () => void;
}

export function ProfileHeader({
  name,
  username,
  bio,
  avatarUrl,
  stats,
  onEditPress,
}: ProfileHeaderProps) {
  const displayName = name || username || "Profile";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <YStack gap="$4">
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

      {bio && (
        <Text fontSize="$4" color="$color11" lineHeight="$5">
          {bio}
        </Text>
      )}

      <XStack gap="$3" flexWrap="wrap">
        <StatPill value={stats.booksRead} label="books" />
        {stats.avgRating !== null && (
          <StatPill value={stats.avgRating.toFixed(1)} label="avg rating" />
        )}
      </XStack>

      {onEditPress && (
        <Button
          size="$3"
          variant="outlined"
          borderColor="$color6"
          onPress={onEditPress}
        >
          <Text color="$color11" fontWeight="500">
            Edit Profile
          </Text>
        </Button>
      )}
    </YStack>
  );
}
