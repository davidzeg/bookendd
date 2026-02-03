import { Text, YStack } from "tamagui";

export default function ProfileScreen() {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$6"
      gap="$2"
      backgroundColor="$background"
    >
      <Text fontSize="$6" fontWeight="bold">
        Profile
      </Text>
      <Text color="$color11">Coming soon</Text>
    </YStack>
  );
}
