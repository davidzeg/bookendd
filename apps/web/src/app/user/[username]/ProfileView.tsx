"use client";

import Image from "next/image";
import { Text, YStack, XStack, Avatar, Theme, Button, useTheme } from "tamagui";
import { Link2, Check } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProfileData } from "@/lib/trpc";

const PLACEHOLDER_COVER =
  "https://placehold.co/120x180/1a1a2e/666666?text=No+Cover";

const COVER_HEIGHT = 150;
const COVER_WIDTH = Math.round(COVER_HEIGHT * (2 / 3));
const STAR_SIZE = Math.round(COVER_HEIGHT / 10);
const LETTER_SIZE = Math.round(COVER_HEIGHT / 9);
const LETTER_LINE_HEIGHT = Math.round(LETTER_SIZE * 1.1);

const AVATAR_SIZE = 96;

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 36;

const READING_COVER_WIDTH = 80;
const READING_COVER_HEIGHT = 120;

function SectionHeader({ title }: { title: string }) {
  return (
    <XStack alignItems="center" gap="$3">
      <YStack
        width={3}
        height={20}
        backgroundColor="$accent8"
        borderRadius="$1"
      />
      <Text fontSize="$5" fontWeight="600" color="$color12">
        {title}
      </Text>
    </XStack>
  );
}

function CopyLinkButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();

  const handleCopy = async () => {
    const url = `${window.location.origin}/user/${username}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      size="$3"
      backgroundColor={copied ? "$color3" : "$color2"}
      borderColor="$color5"
      borderWidth={1}
      pressStyle={{ opacity: 0.8, scale: 0.98 }}
      onPress={handleCopy}
      gap="$2"
    >
      {copied ? (
        <>
          <Check size={16} color={theme.accent10.get()} />
          <Text color="$accent10" fontSize="$2" fontWeight="500">
            Copied!
          </Text>
        </>
      ) : (
        <>
          <Link2 size={16} color={theme.color11.get()} />
          <Text color="$color11" fontSize="$2" fontWeight="500">
            Copy link
          </Text>
        </>
      )}
    </Button>
  );
}

function WordCloud({
  words,
}: {
  words: Array<{ word: string; count: number }>;
}) {
  const sortedWords = useMemo(() => {
    return [...words].sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.word.localeCompare(b.word);
    });
  }, [words]);

  if (words.length === 0) {
    return (
      <YStack
        padding="$6"
        borderRadius="$4"
        alignItems="center"
        justifyContent="center"
        minHeight={140}
        borderWidth={2}
        borderColor="$color4"
        style={{ borderStyle: "dashed" }}
      >
        <Text color="$color10" fontSize="$4" fontWeight="500">
          No words yet
        </Text>
        <Text
          fontSize="$3"
          color="$color9"
          marginTop="$2"
          textAlign="center"
          maxWidth={280}
        >
          Your descriptors will create a word cloud here
        </Text>
      </YStack>
    );
  }

  const maxCount = sortedWords[0]?.count || 1;
  const minCount = sortedWords[sortedWords.length - 1]?.count || 1;

  function getRatio(count: number): number {
    if (maxCount === minCount) return 0.5;
    return (count - minCount) / (maxCount - minCount);
  }

  function getFontSize(count: number): number {
    const ratio = getRatio(count);
    return Math.round(MIN_FONT_SIZE + ratio * (MAX_FONT_SIZE - MIN_FONT_SIZE));
  }

  function getFontWeight(count: number): "400" | "500" | "600" | "700" {
    const ratio = getRatio(count);
    if (ratio > 0.7) return "700";
    if (ratio > 0.4) return "600";
    if (ratio > 0.15) return "500";
    return "400";
  }

  function getOpacity(count: number): number {
    const ratio = getRatio(count);
    return 0.55 + ratio * 0.45;
  }

  function getLetterSpacing(count: number): string {
    const ratio = getRatio(count);
    if (ratio > 0.6) return "0.02em";
    return "0";
  }

  return (
    <XStack
      flexWrap="wrap"
      gap="$3"
      paddingVertical="$5"
      paddingHorizontal="$4"
      backgroundColor="$color2"
      borderRadius="$5"
      justifyContent="center"
      alignItems="baseline"
      minHeight={120}
    >
      {sortedWords.map(({ word, count }) => {
        const ratio = getRatio(count);
        const colorToken = ratio > 0.5 ? "$color12" : "$color11";
        return (
          <Text
            key={word}
            fontSize={getFontSize(count)}
            fontWeight={getFontWeight(count)}
            color={colorToken}
            opacity={getOpacity(count)}
            paddingHorizontal="$1"
            style={{ letterSpacing: getLetterSpacing(count) }}
          >
            {word}
          </Text>
        );
      })}
    </XStack>
  );
}

const FAV_COVER_WIDTH = 110;
const FAV_COVER_HEIGHT = 165;

function CoverTile({
  book,
}: {
  book: { title: string; coverUrl: string | null };
}) {
  return (
    <YStack alignItems="center" gap="$2">
      <YStack
        borderRadius="$3"
        overflow="hidden"
        shadowColor="$color1"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={8}
        style={{
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        hoverStyle={{
          scale: 1.03,
        }}
      >
        <Image
          src={book.coverUrl || PLACEHOLDER_COVER}
          alt={book.title}
          width={FAV_COVER_WIDTH}
          height={FAV_COVER_HEIGHT}
          style={{ objectFit: "cover", display: "block" }}
        />
      </YStack>
      <Text
        fontSize="$2"
        fontWeight="500"
        color="$color11"
        textAlign="center"
        width={FAV_COVER_WIDTH}
        numberOfLines={2}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {book.title}
      </Text>
    </YStack>
  );
}

function FavoritesPreview({
  favorites,
}: {
  favorites: ProfileData["topBooks"];
}) {
  if (favorites.length === 0) {
    return (
      <YStack
        padding="$6"
        borderRadius="$4"
        alignItems="center"
        justifyContent="center"
        minHeight={200}
        borderWidth={2}
        borderColor="$color4"
        style={{ borderStyle: "dashed" }}
      >
        <Text color="$color10" fontSize="$4" fontWeight="500">
          No favorites yet
        </Text>
        <Text
          fontSize="$3"
          color="$color9"
          marginTop="$2"
          textAlign="center"
          maxWidth={280}
        >
          Your top books will appear here when you add them
        </Text>
      </YStack>
    );
  }

  const displayBooks = favorites.slice(0, 4);
  const topRow = displayBooks.slice(0, 2);
  const bottomRow = displayBooks.slice(2, 4);

  return (
    <YStack
      gap="$5"
      paddingVertical="$5"
      paddingHorizontal="$4"
      backgroundColor="$color2"
      borderRadius="$5"
    >
      <XStack gap="$5" justifyContent="center">
        {topRow.map((fav) => (
          <CoverTile key={fav.id} book={fav.book} />
        ))}
      </XStack>
      {bottomRow.length > 0 && (
        <XStack gap="$5" justifyContent="center">
          {bottomRow.map((fav) => (
            <CoverTile key={fav.id} book={fav.book} />
          ))}
        </XStack>
      )}
    </YStack>
  );
}

function VerticalWord({ word }: { word: string }) {
  const displayWord = word.length > 7 ? word.slice(0, 7) : word;
  return (
    <YStack
      height={COVER_HEIGHT}
      alignItems="center"
      justifyContent="center"
      paddingLeft="$1"
    >
      {displayWord.split("").map((letter, index) => (
        <Text
          key={index}
          fontSize={LETTER_SIZE}
          fontWeight="600"
          color="$accent9"
          lineHeight={LETTER_LINE_HEIGHT}
          opacity={0.9}
        >
          {letter.toUpperCase()}
        </Text>
      ))}
    </YStack>
  );
}

function StarDisplay({ rating, size }: { rating: number; size: number }) {
  return (
    <Theme name="star">
      <XStack gap={2}>
        {Array.from({ length: rating }).map((_, i) => (
          <Text key={i} fontSize={size} color="$accent10">
            ★
          </Text>
        ))}
      </XStack>
    </Theme>
  );
}

function DnfBadge() {
  return (
    <Theme name="error">
      <XStack
        backgroundColor="$accent4"
        paddingHorizontal="$2"
        paddingVertical="$1"
        borderRadius="$2"
      >
        <Text fontSize={10} fontWeight="700" color="$accent11">
          DNF
        </Text>
      </XStack>
    </Theme>
  );
}

function ActivityItem({ log }: { log: ProfileData["recentLogs"][0] }) {
  return (
    <XStack gap="$1" alignItems="flex-start" flexShrink={0}>
      <YStack gap="$2" alignItems="center">
        <YStack
          borderRadius="$2"
          overflow="hidden"
          borderWidth={1}
          borderColor="$color4"
        >
          <Image
            src={log.book.coverUrl || PLACEHOLDER_COVER}
            alt={log.book.title}
            width={COVER_WIDTH}
            height={COVER_HEIGHT}
            style={{ objectFit: "cover", display: "block" }}
          />
        </YStack>
        <YStack minHeight={20} justifyContent="center" alignItems="center">
          {log.status === "FINISHED" && log.rating ? (
            <StarDisplay rating={log.rating} size={STAR_SIZE} />
          ) : (
            <DnfBadge />
          )}
        </YStack>
      </YStack>
      {log.word && <VerticalWord word={log.word} />}
    </XStack>
  );
}

function CurrentlyReadingSection({
  logs,
}: {
  logs: ProfileData["recentLogs"];
}) {
  return (
    <XStack
      gap="$4"
      paddingVertical="$3"
      paddingHorizontal="$1"
      className="hide-scrollbar"
      style={{
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollSnapType: "x mandatory",
      }}
    >
      {logs.map((log) => (
        <YStack
          key={log.id}
          alignItems="center"
          gap="$2"
          flexShrink={0}
          style={{ scrollSnapAlign: "start" }}
        >
          <YStack borderRadius={8} overflow="hidden" borderWidth={1} borderColor="$color4">
            <Image
              src={log.book.coverUrl || PLACEHOLDER_COVER}
              alt={log.book.title}
              width={READING_COVER_WIDTH}
              height={READING_COVER_HEIGHT}
              style={{ objectFit: "cover", display: "block" }}
            />
          </YStack>
          <Text
            fontSize="$2"
            fontWeight="500"
            color="$color11"
            textAlign="center"
            width={READING_COVER_WIDTH}
            numberOfLines={2}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {log.book.title}
          </Text>
        </YStack>
      ))}
    </XStack>
  );
}

function RecentActivity({ logs }: { logs: ProfileData["recentLogs"] }) {
  if (logs.length === 0) {
    return (
      <YStack
        padding="$6"
        borderRadius="$4"
        alignItems="center"
        justifyContent="center"
        minHeight={140}
        borderWidth={2}
        borderColor="$color4"
        style={{ borderStyle: "dashed" }}
      >
        <Text color="$color10" fontSize="$4" fontWeight="500">
          No activity yet
        </Text>
        <Text
          fontSize="$3"
          color="$color9"
          marginTop="$2"
          textAlign="center"
          maxWidth={280}
        >
          Your reading journey begins when you log a book
        </Text>
      </YStack>
    );
  }

  return (
    <XStack
      gap="$4"
      paddingVertical="$3"
      paddingHorizontal="$1"
      className="hide-scrollbar"
      style={{
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollSnapType: "x mandatory",
      }}
    >
      {logs.map((log) => (
        <YStack key={log.id} style={{ scrollSnapAlign: "start" }}>
          <ActivityItem log={log} />
        </YStack>
      ))}
    </XStack>
  );
}

export function ProfileView({ data }: { data: ProfileData }) {
  const { user, topBooks, recentLogs, words } = data;
  const displayName = user.name || user.username;

  const currentlyReading = recentLogs.filter(
    (log) => log.status === "READING"
  );
  const completedLogs = recentLogs.filter((log) => log.status !== "READING");

  return (
    <YStack
      flex={1}
      gap="$8"
      maxWidth={640}
      width="100%"
      marginHorizontal="auto"
      paddingHorizontal="$4"
      paddingTop="$6"
      paddingBottom="$10"
    >
      <YStack
        gap="$4"
        paddingVertical="$6"
        paddingHorizontal="$4"
        borderRadius="$6"
        style={{
          background:
            "linear-gradient(180deg, hsla(262, 50%, 20%, 0.4) 0%, transparent 100%)",
        }}
      >
        <XStack gap="$5" alignItems="center">
          <Avatar
            circular
            size={AVATAR_SIZE}
            borderWidth={3}
            borderColor="$accent6"
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={displayName}
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Avatar.Fallback
                backgroundColor="$accent5"
                justifyContent="center"
                alignItems="center"
              >
                <Text color="$accent12" fontSize="$8" fontWeight="700">
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </Avatar.Fallback>
            )}
          </Avatar>
          <YStack flex={1} gap="$1">
            <Text
              fontSize="$8"
              fontWeight="700"
              color="$color12"
              style={{ letterSpacing: "-0.02em" }}
            >
              {displayName}
            </Text>
            {user.username && user.name && (
              <Text fontSize="$4" color="$color10" fontWeight="500">
                @{user.username}
              </Text>
            )}
          </YStack>
        </XStack>
        {user.bio && (
          <Text fontSize="$4" color="$color11" lineHeight="$5" maxWidth={480}>
            {user.bio}
          </Text>
        )}
        <CopyLinkButton username={user.username} />
      </YStack>

      {currentlyReading.length > 0 && (
        <YStack gap="$4">
          <SectionHeader title="Currently Reading" />
          <CurrentlyReadingSection logs={currentlyReading} />
        </YStack>
      )}

      <YStack gap="$4">
        <SectionHeader title="Favorite Books" />
        <FavoritesPreview favorites={topBooks} />
      </YStack>

      <YStack gap="$4">
        <SectionHeader title="Word Cloud" />
        <WordCloud words={words} />
      </YStack>

      <YStack gap="$4">
        <SectionHeader title="Recent Activity" />
        <RecentActivity logs={completedLogs} />
      </YStack>

      <YStack alignItems="center" paddingTop="$4">
        <Text fontSize="$2" color="$color8" fontWeight="500">
          antilogos
        </Text>
      </YStack>
    </YStack>
  );
}
