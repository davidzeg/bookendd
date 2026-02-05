import { Spinner, YStack, Text, Theme } from "tamagui";
import { trpc } from "@/lib/trpc";
import { ProfileView } from "@/components/ProfileView";

export default function ProfileScreen() {
  const profileQuery = trpc.user.myProfile.useQuery();

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

  return <ProfileView data={profileQuery.data} isOwnProfile={true} />;
}
