"use client";

import Image from "next/image";
import { Text, YStack, XStack, Avatar, Theme } from "tamagui";
import { useMemo } from "react";

const PLACEHOLDER_COVER =
  "https://placehold.co/120x180/1a1a2e/666666?text=No+Cover";

const COVER_HEIGHT = 150;
const COVER_WIDTH = Math.round(COVER_HEIGHT * (2 / 3));
const STAR_SIZE = Math.round(COVER_HEIGHT / 10);
const LETTER_SIZE = Math.round(COVER_HEIGHT / 9);
const LETTER_LINE_HEIGHT = Math.round(LETTER_SIZE * 1.1);

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 32;

type ProfileData = {
  user: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    bio: string | null;
  };
  topBooks: Array<{
    id: string;
    book: {
      id: string;
      title: string;
      author: string | null;
      coverUrl: string | null;
    };
  }>;
  recentLogs: Array<{
    id: string;
    status: string;
    rating: number | null;
    word: string | null;
    book: {
      id: string;
      title: string;
      coverUrl: string | null;
    };
  }>;
  words: Array<{
    word: string;
    count: number;
  }>;
};

// ============ Word Cloud ============
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
        padding="$4"
        backgroundColor="$color2"
        borderRadius="$4"
        alignItems="center"
      >
        <Text color="$color11">No words yet</Text>
        <Text fontSize="$2" color="$color10" marginTop="$1">
          Words appear when books are logged with descriptors
        </Text>
      </YStack>
    );
  }

  const maxCount = sortedWords[0]?.count || 1;
  const minCount = sortedWords[sortedWords.length - 1]?.count || 1;

  function getFontSize(count: number): number {
    if (maxCount === minCount) return (MIN_FONT_SIZE + MAX_FONT_SIZE) / 2;
    const ratio = (count - minCount) / (maxCount - minCount);
    return Math.round(MIN_FONT_SIZE + ratio * (MAX_FONT_SIZE - MIN_FONT_SIZE));
  }

  function getFontWeight(count: number): "400" | "500" | "600" | "700" {
    if (maxCount === minCount) return "500";
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.75) return "700";
    if (ratio > 0.5) return "600";
    if (ratio > 0.25) return "500";
    return "400";
  }

  return (
    <XStack
      flexWrap="wrap"
      gap="$2"
      padding="$4"
      backgroundColor="$color2"
      borderRadius="$4"
      justifyContent="center"
      alignItems="center"
    >
      {sortedWords.map(({ word, count }) => (
        <Text
          key={word}
          fontSize={getFontSize(count)}
          fontWeight={getFontWeight(count)}
          color="$color11"
          paddingHorizontal="$1"
        >
          {word}
        </Text>
      ))}
    </XStack>
  );
}

// ============ Favorites Preview ============
function CoverTile({
  book,
}: {
  book: { title: string; coverUrl: string | null };
}) {
  return (
    <YStack alignItems="center" gap="$2">
      <Image
        src={book.coverUrl || PLACEHOLDER_COVER}
        alt={book.title}
        width={80}
        height={120}
        style={{ borderRadius: 8, objectFit: "cover" }}
      />
      <Text
        fontSize="$2"
        color="$color11"
        textAlign="center"
        width={80}
        numberOfLines={1}
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
        padding="$4"
        backgroundColor="$color2"
        borderRadius="$4"
        alignItems="center"
      >
        <Text color="$color11">No favorites yet</Text>
        <Text fontSize="$2" color="$color10" marginTop="$1">
          Favorites appear when added from logs
        </Text>
      </YStack>
    );
  }

  const displayBooks = favorites.slice(0, 4);
  const topRow = displayBooks.slice(0, 2);
  const bottomRow = displayBooks.slice(2, 4);

  return (
    <YStack gap="$4" padding="$3" backgroundColor="$color2" borderRadius="$4">
      <XStack gap="$3" justifyContent="center">
        {topRow.map((fav) => (
          <CoverTile key={fav.id} book={fav.book} />
        ))}
      </XStack>
      {bottomRow.length > 0 && (
        <XStack gap="$3" justifyContent="center">
          {bottomRow.map((fav) => (
            <CoverTile key={fav.id} book={fav.book} />
          ))}
        </XStack>
      )}
    </YStack>
  );
}

// ============ Recent Activity ============
function VerticalWord({ word }: { word: string }) {
  const displayWord = word.length > 8 ? word.slice(0, 8) : word;
  return (
    <YStack
      height={COVER_HEIGHT}
      alignItems="center"
      justifyContent="center"
      gap={-2}
    >
      {displayWord.split("").map((letter, index) => (
        <Text
          key={index}
          fontSize={LETTER_SIZE}
          fontWeight="600"
          color="$accent10"
          lineHeight={LETTER_LINE_HEIGHT}
        >
          {letter.toUpperCase()}
        </Text>
      ))}
    </YStack>
  );
}

function StarDisplay({ rating, size }: { rating: number; size: number }) {
  return (
    <XStack gap={2}>
      {Array.from({ length: rating }).map((_, i) => (
        <Text key={i} fontSize={size} color="$accent10">
          ★
        </Text>
      ))}
    </XStack>
  );
}

function DnfBadge() {
  return (
    <Theme name="error">
      <Text fontSize={STAR_SIZE} fontWeight="600" color="$accent10">
        DNF
      </Text>
    </Theme>
  );
}

function ActivityItem({ log }: { log: ProfileData["recentLogs"][0] }) {
  return (
    <XStack gap="$1" alignItems="flex-start" flexShrink={0}>
      <YStack gap="$2" alignItems="center">
        <Image
          src={log.book.coverUrl || PLACEHOLDER_COVER}
          alt={log.book.title}
          width={COVER_WIDTH}
          height={COVER_HEIGHT}
          style={{ borderRadius: 4, objectFit: "cover" }}
        />
        <YStack height={STAR_SIZE} justifyContent="center" alignItems="center">
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

function RecentActivity({ logs }: { logs: ProfileData["recentLogs"] }) {
  if (logs.length === 0) {
    return (
      <YStack
        padding="$4"
        backgroundColor="$color2"
        borderRadius="$4"
        alignItems="center"
      >
        <Text color="$color11">No activity yet</Text>
        <Text fontSize="$2" color="$color10" marginTop="$1">
          Activity appears when books are logged
        </Text>
      </YStack>
    );
  }

  return (
    <XStack
      gap="$3"
      paddingVertical="$2"
      style={{
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {logs.map((log) => (
        <ActivityItem key={log.id} log={log} />
      ))}
    </XStack>
  );
}

// ============ Main Profile View ============
export function ProfileView({ data }: { data: ProfileData }) {
  const { user, topBooks, recentLogs, words } = data;
  const displayName = user.name || user.username;

  return (
    <YStack
      flex={1}
      padding="$4"
      gap="$6"
      maxWidth={600}
      marginHorizontal="auto"
    >
      {/* Header */}
      <YStack gap="$2">
        <XStack gap="$4" alignItems="center">
          <Avatar circular size="$8">
            <Avatar.Image src={user.avatarUrl || undefined} />
            <Avatar.Fallback
              backgroundColor="$accent5"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="$accent12" fontSize="$6" fontWeight="600">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </Avatar.Fallback>
          </Avatar>
          <YStack flex={1}>
            <Text fontSize="$7" fontWeight="bold" color="$color12">
              {displayName}
            </Text>
            {user.username && user.name && (
              <Text fontSize="$4" color="$color11">
                @{user.username}
              </Text>
            )}
          </YStack>
        </XStack>
        {user.bio && (
          <Text fontSize="$4" color="$color11" marginTop="$2">
            {user.bio}
          </Text>
        )}
      </YStack>

      {/* Favorite Books */}
      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="600" color="$color12">
          Favorite Books
        </Text>
        <FavoritesPreview favorites={topBooks} />
      </YStack>

      {/* Word Cloud */}
      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="600" color="$color12">
          Word Cloud
        </Text>
        <WordCloud words={words} />
      </YStack>

      {/* Recent Activity */}
      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="600" color="$color12">
          Recent Activity
        </Text>
        <RecentActivity logs={recentLogs} />
      </YStack>
    </YStack>
  );
}
