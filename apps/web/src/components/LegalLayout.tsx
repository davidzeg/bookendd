"use client";

import { Text, YStack, XStack } from "tamagui";
import Link from "next/link";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <YStack
      flex={1}
      minHeight="100vh"
      position="relative"
      paddingHorizontal="$4"
      paddingTop="$8"
      paddingBottom="$6"
    >
      <YStack
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        pointerEvents="none"
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsla(262, 50%, 12%, 1) 0%, hsla(262, 45%, 8%, 1) 100%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <YStack
        flex={1}
        maxWidth={640}
        width="100%"
        marginHorizontal="auto"
        gap="$6"
        position="relative"
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Text
            fontSize="$6"
            fontWeight="700"
            color="$accent10"
            style={{ letterSpacing: "-0.03em" }}
          >
            bookendd
          </Text>
        </Link>

        <YStack gap="$2">
          <Text
            fontSize="$9"
            fontWeight="700"
            color="$color12"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </Text>
          <Text fontSize="$3" color="$color10">
            Last updated: {lastUpdated}
          </Text>
        </YStack>

        <YStack gap="$6">{children}</YStack>

        <YStack
          gap="$4"
          paddingTop="$8"
          borderTopWidth={1}
          borderTopColor="$color4"
        >
          <XStack gap="$4">
            <Link href="/privacy" style={{ textDecoration: "none" }}>
              <Text
                fontSize="$2"
                color="$color9"
                hoverStyle={{ color: "$color11" }}
              >
                Privacy Policy
              </Text>
            </Link>
            <Text fontSize="$2" color="$color8">
              ·
            </Text>
            <Link href="/terms" style={{ textDecoration: "none" }}>
              <Text
                fontSize="$2"
                color="$color9"
                hoverStyle={{ color: "$color11" }}
              >
                Terms of Service
              </Text>
            </Link>
            <Text fontSize="$2" color="$color8">
              ·
            </Text>
            <Link href="/guidelines" style={{ textDecoration: "none" }}>
              <Text
                fontSize="$2"
                color="$color9"
                hoverStyle={{ color: "$color11" }}
              >
                Community Guidelines
              </Text>
            </Link>
          </XStack>
          <Text fontSize="$1" color="$color8">
            © 2025 Bookendd
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <YStack gap="$3">
      <Text fontSize="$6" fontWeight="600" color="$color12">
        {title}
      </Text>
      {children}
    </YStack>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <Text fontSize="$4" color="$color11" lineHeight="$6">
      {children}
    </Text>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <YStack gap="$2" paddingLeft="$4">
      {items.map((item, i) => (
        <XStack key={i} gap="$2">
          <Text fontSize="$4" color="$color10">
            •
          </Text>
          <Text fontSize="$4" color="$color11" lineHeight="$6" flex={1}>
            {item}
          </Text>
        </XStack>
      ))}
    </YStack>
  );
}
