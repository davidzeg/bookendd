import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { YStack, Text } from "tamagui";

export default function ModalScreen() {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
      <Text fontSize="$6" fontWeight="bold">
        Modal
      </Text>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </YStack>
  );
}
