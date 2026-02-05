import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spinner, Text, YStack } from "tamagui";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";
import { ProfileView } from "@/components/ProfileView";

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profileQuery = trpc.user.byUsername.useQuery(
    { username: username ?? "" },
    { enabled: !!username },
  );

  if (profileQuery.isLoading) {
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

  if (!profileQuery.data) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingTop={insets.top + 16}
        paddingHorizontal="$4"
      >
        <Button size="$3" circular chromeless onPress={() => router.back()}>
          <ArrowLeft size={24} color="$color12" />
        </Button>
        <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
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
