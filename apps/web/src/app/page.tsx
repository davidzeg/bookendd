"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Text, YStack, XStack, Input, Button } from "tamagui";
import { Star, MessageSquare, Share2 } from "lucide-react";
import { useTheme } from "tamagui";
import Link from "next/link";

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <XStack gap="$3" alignItems="flex-start">
      <YStack
        backgroundColor="$color2"
        padding="$2"
        borderRadius={8}
        marginTop="$1"
      >
        {icon}
      </YStack>
      <YStack gap="$1" flex={1}>
        <Text fontSize="$4" fontWeight="600" color="$color12">
          {title}
        </Text>
        <Text fontSize="$3" color="$color10" lineHeight="$4">
          {description}
        </Text>
      </YStack>
    </XStack>
  );
}

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const theme = useTheme();

  const handleViewProfile = () => {
    const trimmed = username.trim();
    if (trimmed) {
      router.push(`/user/${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleViewProfile();
    }
  };

  return (
    <YStack
      flex={1}
      minHeight="100vh"
      paddingHorizontal="$4"
      paddingTop="$10"
      paddingBottom="$6"
      style={{
        background:
          "linear-gradient(180deg, hsla(262, 50%, 12%, 1) 0%, hsla(262, 45%, 8%, 1) 100%)",
      }}
    >
      <YStack
        flex={1}
        maxWidth={480}
        width="100%"
        marginHorizontal="auto"
        gap="$8"
      >
        <YStack gap="$4" paddingTop="$6">
          <Text
            fontSize="$10"
            fontWeight="700"
            color="$accent10"
            style={{ letterSpacing: "-0.03em" }}
          >
            bookendd
          </Text>
          <Text fontSize="$6" color="$color11" lineHeight="$7" maxWidth={400}>
            Track your reading journey with a single word.
          </Text>
        </YStack>

        <YStack gap="$3">
          <Text fontSize="$3" fontWeight="500" color="$color11">
            View a profile
          </Text>
          <XStack gap="$3">
            <Input
              flex={1}
              size="$4"
              placeholder="Enter username"
              backgroundColor="$color2"
              borderColor="$color4"
              borderWidth={1}
              color="$color12"
              placeholderTextColor="$color9"
              value={username}
              onChangeText={setUsername}
              onKeyDown={handleKeyDown}
              autoCorrect="off"
            />
            <Button
              size="$4"
              backgroundColor="$accent6"
              pressStyle={{ backgroundColor: "$accent7", scale: 0.98 }}
              onPress={handleViewProfile}
              disabled={!username.trim()}
              opacity={username.trim() ? 1 : 0.5}
            >
              <Button.Text color="$color12" fontWeight="600">
                Go
              </Button.Text>
            </Button>
          </XStack>
        </YStack>

        <YStack gap="$5" paddingVertical="$4">
          <FeatureItem
            icon={<Star size={20} color={theme.accent10.get()} />}
            title="Six-star ratings"
            description="No mushy middle. Force yourself to choose."
          />
          <FeatureItem
            icon={<MessageSquare size={20} color={theme.accent10.get()} />}
            title="One-word descriptors"
            description="Capture the essence of each book in a single word."
          />
          <FeatureItem
            icon={<Share2 size={20} color={theme.accent10.get()} />}
            title="Shareable profiles"
            description="Your reading history, beautifully displayed."
          />
        </YStack>

        <YStack
          gap="$3"
          paddingVertical="$5"
          paddingHorizontal="$4"
          backgroundColor="$color2"
          borderRadius="$4"
        >
          <Text fontSize="$3" fontWeight="600" color="$color11">
            Coming soon to iOS and Android
          </Text>
          <XStack gap="$3" flexWrap="wrap">
            <XStack
              paddingHorizontal="$3"
              paddingVertical="$2"
              backgroundColor="$color3"
              borderRadius="$3"
            >
              <Text fontSize="$2" color="$color10">
                App Store
              </Text>
            </XStack>
            <XStack
              paddingHorizontal="$3"
              paddingVertical="$2"
              backgroundColor="$color3"
              borderRadius="$3"
            >
              <Text fontSize="$2" color="$color10">
                Play Store
              </Text>
            </XStack>
          </XStack>
        </YStack>

        <YStack flex={1} minHeight={40} />

        <YStack gap="$4" paddingTop="$4">
          <XStack gap="$4">
            <Link href="/privacy" style={{ textDecoration: "none" }}>
              <Text fontSize="$2" color="$color9">
                Privacy Policy
              </Text>
            </Link>
            <Text fontSize="$2" color="$color8">
              ·
            </Text>
            <Link href="/terms" style={{ textDecoration: "none" }}>
              <Text fontSize="$2" color="$color9">
                Terms of Service
              </Text>
            </Link>
            <Text fontSize="$2" color="$color8">
              ·
            </Text>
            <Link href="/guidelines" style={{ textDecoration: "none" }}>
              <Text fontSize="$2" color="$color9">
                Guidelines
              </Text>
            </Link>
          </XStack>
          <Text fontSize="$1" color="$color8">
            © 2026 Bookendd
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}
