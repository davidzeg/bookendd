import { Text, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      paddingTop={insets.top}
      backgroundColor="$background"
    >
      <Text fontSize="$6" fontWeight="bold">
        Profile
      </Text>
      <Text color="$gray10" marginTop="$2">
        Coming soon
      </Text>
    </YStack>
  );
}
