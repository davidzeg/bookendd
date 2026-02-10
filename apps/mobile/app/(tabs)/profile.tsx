import { ScrollView, YStack, Text, Theme } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { trpc } from "@/lib/trpc";
import { ProfileView } from "@/components/ProfileView";
import { ProfileViewSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/Button";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const profileQuery = trpc.user.myProfile.useQuery();

  if (profileQuery.isLoading) {
    return (
      <YStack flex={1} backgroundColor="$background" paddingTop={insets.top + 16}>
        <ScrollView
          flex={1}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 24,
          }}
        >
          <ProfileViewSkeleton />
        </ScrollView>
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
          {profileQuery.error?.message ?? "Could not load your profile"}
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

  return (
    <ProfileView
      data={profileQuery.data}
      isOwnProfile={true}
      onRefresh={() => profileQuery.refetch()}
      isRefreshing={profileQuery.isRefetching}
    />
  );
}
