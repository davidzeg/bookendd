"use client";

import Link from "next/link";
import { Text, YStack, Button } from "tamagui";

export default function NotFound() {
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
        <Text fontSize="$10" fontWeight="700" color="$accent10">
          404
        </Text>
        <Text fontSize="$6" fontWeight="600" color="$color12">
          Page not found
        </Text>
        <Text
          fontSize="$4"
          color="$color10"
          textAlign="center"
          maxWidth={320}
        >
          The page you're looking for doesn't exist or has been moved.
        </Text>
      </YStack>
      <Link href="/" style={{ textDecoration: "none" }}>
        <Button
          size="$4"
          backgroundColor="$accent6"
          pressStyle={{ backgroundColor: "$accent7", scale: 0.98 }}
        >
          <Button.Text color="$color12" fontWeight="600">
            Go home
          </Button.Text>
        </Button>
      </Link>
      <Text fontSize="$2" color="$color8" fontWeight="500">
        antilogos
      </Text>
    </YStack>
  );
}
