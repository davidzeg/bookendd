import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, ScrollView, Spinner, Text, Theme, XStack, YStack } from "tamagui";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
} from "@tamagui/lucide-icons";
import { Alert } from "react-native";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";
import { haptics } from "@/lib/haptics";
import { analytics } from "@/lib/posthog";

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

  // Check existing logs for this book (limited to 20 most recent)
  const logsQuery = trpc.log.listMine.useQuery();
  const existingLog =
    logsQuery.data?.find(
      (log) => log.book.openLibraryId === params.openLibraryId,
    ) ?? null;
  const activeReadingLog =
    logsQuery.data?.find(
      (log) =>
        log.book.openLibraryId === params.openLibraryId &&
        log.status === "READING",
    ) ?? null;
  const statusLog = activeReadingLog ?? existingLog;

  const createLog = trpc.log.create.useMutation({
    onSuccess: () => {
      haptics.success();
      analytics.bookStarted();
      utils.log.listMine.invalidate();
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
        paddingHorizontal="$4"
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
        <YStack alignItems="center" padding="$4" gap="$3">
          <YStack
            borderRadius={12}
            overflow="hidden"
            shadowColor="$color1"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={8}
          >
            <Image
              src={
                params.coverUrl ||
                "https://placehold.co/140x210/1a1a2e/666666?text=No+Cover"
              }
              width={140}
              height={210}
              backgroundColor="$color2"
            />
          </YStack>

          <Text
            fontSize="$7"
            fontWeight="700"
            color="$color12"
            textAlign="center"
            numberOfLines={3}
          >
            {params.title}
          </Text>
          {params.author ? (
            <Text fontSize="$4" color="$color11" textAlign="center">
              {params.author}
            </Text>
          ) : null}
          {params.year ? (
            <Text fontSize="$3" color="$color10" textAlign="center">
              {params.year}
            </Text>
          ) : null}
        </YStack>

        {/* Status Badge */}
        {statusLog && (
          <YStack paddingHorizontal="$4" paddingBottom="$3" alignItems="center">
            <StatusBadge status={statusLog.status} />
          </YStack>
        )}

        {/* Description */}
        <YStack padding="$4" gap="$2">
          <Text fontSize="$3" fontWeight="600" color="$color12">
            ABOUT
          </Text>
          {descLoading ? (
            <YStack padding="$4" alignItems="center">
              <Spinner size="small" color="$accent10" />
            </YStack>
          ) : description ? (
            <Text fontSize="$3" color="$color11" lineHeight={22}>
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
        <YStack padding="$4" paddingBottom={insets.bottom + 16} gap="$3">
          {activeReadingLog ? (
            <Button
              size="$5"
              theme="accent"
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
        paddingHorizontal="$4"
        paddingVertical="$2"
        borderRadius={20}
        gap="$2"
        alignItems="center"
      >
        <Icon size={16} color="$color11" />
        <Text fontSize="$3" fontWeight="600" color="$color11">
          {config.label}
        </Text>
      </XStack>
    </Theme>
  );
}
