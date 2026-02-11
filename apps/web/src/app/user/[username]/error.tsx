"use client";

import { Text, YStack, Button } from "tamagui";

export default function ProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <YStack
      flex={1}
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="$4"
      gap="$6"
      style={{
        background:
          "linear-gradient(180deg, hsla(262, 50%, 12%, 1) 0%, hsla(262, 45%, 8%, 1) 100%)",
      }}
    >
      <YStack alignItems="center" gap="$3">
        <Text fontSize="$6" fontWeight="600" color="$color12">
          Something went wrong
        </Text>
        <Text
          fontSize="$4"
          color="$color10"
          textAlign="center"
          maxWidth={320}
        >
          We couldn't load this profile. Please try again.
        </Text>
      </YStack>
      <Button
        size="$4"
        backgroundColor="$accent6"
        pressStyle={{ backgroundColor: "$accent7", scale: 0.98 }}
        onPress={reset}
      >
        <Button.Text color="$color12" fontWeight="600">
          Try again
        </Button.Text>
      </Button>
      <Text fontSize="$2" color="$color8" fontWeight="500">
        antilogos
      </Text>
    </YStack>
  );
}
