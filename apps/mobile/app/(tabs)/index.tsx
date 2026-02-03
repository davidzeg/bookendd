import { Text, YStack } from "tamagui";

export default function HomeScreen() {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$6"
      gap="$3"
      backgroundColor="$background"
    >
      <Text fontSize="$7" fontWeight="bold" textAlign="center">
        What have you been reading?
      </Text>
      <Text color="$color11" textAlign="center">
        Tap the search button to log a book
      </Text>
    </YStack>
  );
}
