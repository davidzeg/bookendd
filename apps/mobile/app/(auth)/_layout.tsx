import { Stack } from "expo-router";
import { YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const insets = useSafeAreaInsets();

  return (
    <YStack
      flex={1}
      paddingTop={insets.top}
      paddingBottom={insets.bottom}
      paddingLeft={insets.left}
      paddingRight={insets.right}
      backgroundColor="$background"
    >
      <Stack screenOptions={{ headerShown: false }} />
    </YStack>
  );
}
