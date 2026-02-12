import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";
import { AlertCircle, ArrowLeft, UserX } from "@tamagui/lucide-icons";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";
import { ProfileView } from "@/components/ProfileView";
import { ProfileViewSkeleton } from "@/components/skeletons/ProfileViewSkeleton";
import { SCREEN_PADDING_H } from "@/components/ui/tokens";

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profileQuery = trpc.user.byUsername.useQuery(
    { username: username ?? "" },
    { enabled: !!username },
  );

  if (profileQuery.isLoading) {
    return <ProfileViewSkeleton />;
  }

  if (profileQuery.isError) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingTop={insets.top + 16}
        paddingHorizontal={SCREEN_PADDING_H}
      >
        <Button size="$3" circular chromeless onPress={() => router.back()}>
          <ArrowLeft size={24} color="$color12" />
        </Button>
        <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
          <AlertCircle size={48} color="$color8" />
          <Text fontSize="$6" fontWeight="600" color="$color12">
            Something went wrong
          </Text>
          <Text fontSize="$4" color="$color11">
            Could not load this profile
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
      </YStack>
    );
  }

  if (!profileQuery.data) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingTop={insets.top + 16}
        paddingHorizontal={SCREEN_PADDING_H}
      >
        <Button size="$3" circular chromeless onPress={() => router.back()}>
          <ArrowLeft size={24} color="$color12" />
        </Button>
        <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
          <UserX size={48} color="$color8" />
          <Text fontSize="$6" fontWeight="600" color="$color12">
            User not found
          </Text>
          <Text fontSize="$4" color="$color11">
            @{username} doesn't exist
          </Text>
        </YStack>
      </YStack>
    );
  }

  return (
    <ProfileView
      data={profileQuery.data}
      isOwnProfile={false}
      showBackButton={true}
    />
  );
}
