"use client";

import { Text, YStack } from "tamagui";

export default function Home() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      <Text fontSize="$8" color="$accent10">
        Bookendd
      </Text>
      <Text color="$color11">Public profiles coming soon</Text>
    </YStack>
  );
}
