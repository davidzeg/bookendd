import { YStack, Text } from "tamagui";
import { trpc } from "../../lib/trpc";

export default function TabOneScreen() {
  const healthQuery = trpc.health.check.useQuery();
  const authTest = trpc.health.authTest.useQuery();

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
      <Text fontSize="$6" fontWeight="bold">
        Tab One
      </Text>

      <YStack padding="$4" backgroundColor="$blue5" borderRadius="$4">
        {healthQuery.isLoading && <Text color="$blue11">Checking API...</Text>}

        {healthQuery.error && (
          <Text color="$red11">Error: {healthQuery.error.message}</Text>
        )}

        {healthQuery.data && (
          <YStack gap="$2">
            <Text color="$green11">Status: {healthQuery.data.status}</Text>
            <Text color="$blue11" fontSize="$3">
              Timestamp: {healthQuery.data.timestamp}
            </Text>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
}
