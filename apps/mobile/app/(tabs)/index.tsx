import { YStack, Text } from "tamagui";

export default function TabOneScreen() {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
      <Text fontSize="$6" fontWeight="bold">
        Tab One
      </Text>

      <YStack padding="$4" backgroundColor="$blue5" borderRadius="$4">
        <Text color="$blue11">Tamagui is working!</Text>
      </YStack>
    </YStack>
  );
}
