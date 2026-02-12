import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Avatar,
  ScrollView,
  Spinner,
  Text,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
} from "@tamagui/lucide-icons";
import { Alert } from "react-native";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/ui/BookCover";
import {
  RADIUS_MD,
  RADIUS_LG,
  SCREEN_PADDING_H,
  SHADOW_SUBTLE,
} from "@/components/ui/tokens";
import { haptics } from "@/lib/haptics";
import { analytics } from "@/lib/posthog";

function AvatarStack({
  loggers,
  onPressUser,
}: {
  loggers: Array<{
    user: {
      id: string;
      username: string;
      name: string | null;
      avatarUrl: string | null;
    };
  }>;
  onPressUser: (username: string) => void;
}) {
  return (
    <XStack alignItems="center">
      {loggers.map((logger, i) => (
        <Button
          key={logger.user.id}
          size="$2"
          circular
          chromeless
          padding={0}
          onPress={() => onPressUser(logger.user.username)}
          accessibilityLabel={`View ${logger.user.name || logger.user.username}'s profile`}
          accessibilityRole="button"
          marginLeft={i > 0 ? -8 : 0}
          zIndex={loggers.length - i}
        >
          <Avatar circular size={32} borderWidth={2} borderColor="$background">
            {logger.user.avatarUrl ? (
              <Avatar.Image src={logger.user.avatarUrl} />
            ) : (
              <Avatar.Fallback
                backgroundColor="$accent5"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="$accent12" fontSize={12} fontWeight="700">
                  {(
                    logger.user.name?.[0] || logger.user.username[0]
                  ).toUpperCase()}
                </Text>
              </Avatar.Fallback>
            )}
          </Avatar>
        </Button>
      ))}
    </XStack>
  );
}

function BookActivity({ openLibraryId }: { openLibraryId: string }) {
  const router = useRouter();
  const meQuery = trpc.user.me.useQuery();
  const activityQuery = trpc.log.bookActivity.useQuery({ openLibraryId });

  const data = activityQuery.data;
  if (!data) return null;

  const { counts, recentLoggers } = data;
  const otherLoggers = recentLoggers.filter(
    (l) => l.user.id !== meQuery.data?.id,
  );

  if (otherLoggers.length === 0) return null;

  const parts: string[] = [];
  if (counts.FINISHED > 0) parts.push(`${counts.FINISHED} read`);
  if (counts.READING > 0) parts.push(`${counts.READING} reading`);
  if (counts.DNF > 0) parts.push(`${counts.DNF} DNF`);

  return (
    <YStack
      paddingHorizontal={SCREEN_PADDING_H}
      paddingTop="$2"
      paddingBottom="$1"
      gap="$2"
    >
      <Text
        fontSize="$3"
        fontWeight="600"
        color="$color10"
        textTransform="uppercase"
        style={{ letterSpacing: 0.5 }}
      >
        Community
      </Text>
      <XStack alignItems="center" gap="$3">
        <AvatarStack
          loggers={otherLoggers}
          onPressUser={(username) => router.push(`/user/${username}`)}
        />
        <Text fontSize="$3" color="$color11" fontWeight="500">
          {parts.join("  ·  ")}
        </Text>
      </XStack>
    </YStack>
  );
}

export default function BookDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    openLibraryId: string;
    title: string;
    author: string;
    coverUrl: string;
    year: string;
  }>();

  const [description, setDescription] = useState<string | null>(null);
  const [descLoading, setDescLoading] = useState(true);

  const utils = trpc.useUtils();

  // Fetch description from OpenLibrary
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    const fetchDescription = async () => {
      try {
        const res = await fetch(
          `https://openlibrary.org${params.openLibraryId}.json`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) {
          const desc = data.description;
          if (typeof desc === "string") {
            setDescription(desc);
          } else if (desc && typeof desc === "object" && desc.value) {
            setDescription(desc.value);
          }
        }
      } catch {
        // Description is optional — silent failure
      } finally {
        clearTimeout(timer);
        if (!cancelled) setDescLoading(false);
      }
    };

    fetchDescription();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [params.openLibraryId]);

  const bookStatusQuery = trpc.log.bookStatus.useQuery({
    openLibraryId: params.openLibraryId,
  });
  const existingLog = bookStatusQuery.data ?? null;
  const activeReadingLog =
    existingLog?.status === "READING" ? existingLog : null;
  const statusLog = existingLog;

  const createLog = trpc.log.create.useMutation({
    onSuccess: () => {
      haptics.success();
      analytics.bookStarted();
      utils.log.listMine.invalidate();
      utils.log.bookStatus.invalidate({ openLibraryId: params.openLibraryId });
      utils.user.topBooksMine.invalidate();
      utils.user.myProfile.invalidate();
      router.back();
    },
    onError: (error) => {
      haptics.error();
      Alert.alert("Error", error.message || "Failed to start reading");
    },
  });

  const handleStartReading = () => {
    createLog.mutate({
      openLibraryId: params.openLibraryId,
      title: params.title,
      author: params.author || null,
      coverUrl: params.coverUrl || null,
      status: "READING",
    });
  };

  const handleFinishReading = () => {
    if (!activeReadingLog) return;

    router.push({
      pathname: "/log-book",
      params: {
        openLibraryId: params.openLibraryId,
        title: params.title,
        author: params.author,
        coverUrl: params.coverUrl,
        year: params.year,
        mode: "finish",
        logId: activeReadingLog.id,
      },
    });
  };

  const handleLogBook = () => {
    router.push({
      pathname: "/log-book",
      params: {
        openLibraryId: params.openLibraryId,
        title: params.title,
        author: params.author,
        coverUrl: params.coverUrl,
        year: params.year,
        mode: "create",
      },
    });
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={SCREEN_PADDING_H}
        paddingVertical="$3"
      >
        <Button
          size="$3"
          circular
          chromeless
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color="$color12" />
        </Button>
        <Text fontSize="$5" fontWeight="600" color="$color12">
          Book Details
        </Text>
        <YStack width={40} />
      </XStack>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        backgroundColor="$background"
      >
        {/* Book Info */}
        <YStack
          alignItems="center"
          padding={SCREEN_PADDING_H}
          gap="$3"
          marginTop={8}
        >
          <BookCover uri={params.coverUrl || null} size="detail" />

          <Text
            fontSize="$8"
            fontWeight="700"
            color="$color12"
            textAlign="center"
            numberOfLines={3}
            style={{ letterSpacing: -0.5 }}
            marginTop="$2"
          >
            {params.title}
          </Text>
          {params.author ? (
            <Text
              fontSize="$5"
              fontWeight="500"
              color="$color11"
              textAlign="center"
            >
              {params.author}
            </Text>
          ) : null}
          {params.year ? (
            <Text
              fontSize="$3"
              color="$color10"
              textAlign="center"
              fontFamily={"SpaceMono" as any}
            >
              {params.year}
            </Text>
          ) : null}
        </YStack>

        {/* Status Badge */}
        {statusLog && (
          <YStack
            paddingHorizontal={SCREEN_PADDING_H}
            paddingBottom="$3"
            alignItems="center"
          >
            <StatusBadge status={statusLog.status} />
          </YStack>
        )}

        <BookActivity openLibraryId={params.openLibraryId} />

        {/* Divider */}
        <YStack
          height={1}
          backgroundColor="$color3"
          marginHorizontal={SCREEN_PADDING_H}
          marginVertical="$4"
        />

        {/* Description */}
        <YStack paddingHorizontal={SCREEN_PADDING_H} gap="$2">
          <Text
            fontSize="$3"
            fontWeight="600"
            color="$color10"
            textTransform="uppercase"
            style={{ letterSpacing: 0.5 }}
          >
            About
          </Text>
          {descLoading ? (
            <YStack padding="$4" alignItems="center">
              <Spinner size="small" color="$accent10" />
            </YStack>
          ) : description ? (
            <Text fontSize="$4" color="$color11" lineHeight={24}>
              {description}
            </Text>
          ) : (
            <Text fontSize="$3" color="$color10" fontStyle="italic">
              No description available
            </Text>
          )}
        </YStack>

        <YStack flex={1} minHeight={24} />

        {/* CTA Buttons */}
        <YStack
          paddingHorizontal={SCREEN_PADDING_H}
          paddingBottom={insets.bottom + 16}
          gap="$4"
        >
          {activeReadingLog ? (
            <Button
              size="$5"
              theme="accent"
              borderRadius={RADIUS_MD}
              height={56}
              onPress={handleFinishReading}
              accessibilityLabel="Finish reading this book"
              accessibilityRole="button"
            >
              <XStack gap="$2" alignItems="center">
                <CheckCircle size={20} color="$color12" />
                <Button.Text fontWeight="700" fontSize="$5">
                  Finish Reading
                </Button.Text>
              </XStack>
            </Button>
          ) : (
            <Button
              size="$5"
              theme="accent"
              borderRadius={RADIUS_MD}
              height={56}
              onPress={handleStartReading}
              disabled={createLog.isPending}
              opacity={createLog.isPending ? 0.6 : 1}
              accessibilityLabel={
                createLog.isPending ? "Starting..." : "Start reading this book"
              }
              accessibilityRole="button"
            >
              <XStack gap="$2" alignItems="center">
                <BookOpen size={20} color="$color12" />
                <Button.Text fontWeight="700" fontSize="$5">
                  {createLog.isPending ? "Starting..." : "Start Reading"}
                </Button.Text>
              </XStack>
            </Button>
          )}

          {!activeReadingLog && !existingLog && (
            <Button
              size="$5"
              variant="outlined"
              borderWidth={2}
              borderRadius={RADIUS_MD}
              height={56}
              onPress={handleLogBook}
              accessibilityLabel="Log this book"
              accessibilityRole="button"
            >
              <Button.Text fontWeight="700" fontSize="$5">
                Log Book
              </Button.Text>
            </Button>
          )}

          {!activeReadingLog &&
            existingLog &&
            existingLog.status !== "READING" && (
              <Button
                size="$5"
                variant="outlined"
                borderWidth={2}
                borderRadius={RADIUS_MD}
                height={56}
                onPress={handleLogBook}
                accessibilityLabel="Log this book again"
                accessibilityRole="button"
              >
                <Button.Text fontWeight="700" fontSize="$5">
                  Log Again
                </Button.Text>
              </Button>
            )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    READING: {
      theme: "accent" as const,
      icon: BookOpen,
      label: "Currently Reading",
    },
    FINISHED: {
      theme: "success" as const,
      icon: CheckCircle,
      label: "Read",
    },
    DNF: {
      theme: "error" as const,
      icon: XCircle,
      label: "Did Not Finish",
    },
  }[status];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <Theme name={config.theme}>
      <XStack
        backgroundColor="$color3"
        paddingHorizontal="$5"
        paddingVertical="$2"
        borderRadius={RADIUS_LG}
        gap="$2"
        alignItems="center"
        style={SHADOW_SUBTLE}
      >
        <Icon size={16} color="$color11" />
        <Text fontSize="$3" fontWeight="600" color="$color11">
          {config.label}
        </Text>
      </XStack>
    </Theme>
  );
}
