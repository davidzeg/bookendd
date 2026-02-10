import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Image,
  Text,
  XStack,
  YStack,
  Input,
  ScrollView,
  useTheme,
} from "tamagui";
import { Star, X } from "@tamagui/lucide-icons";
import { Button } from "@/components/ui/Button";
import { StatusButton } from "@/components/ui/StatusButton";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { trpc } from "@/lib/trpc";
import { analytics } from "@/lib/posthog";
import { haptics } from "@/lib/haptics";

type LogStatus = "FINISHED" | "DNF" | null;
type LogBookMode = "create" | "finish";

export default function LogBookModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    openLibraryId: string;
    title: string;
    author: string;
    coverUrl: string;
    year: string;
    mode?: LogBookMode;
    logId?: string;
  }>();
  const mode = params.mode === "finish" ? "finish" : "create";
  const isFinishMode = mode === "finish";

  const [status, setStatus] = useState<LogStatus>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [word, setWord] = useState("");
  const [review, setReview] = useState("");

  const utils = trpc.useUtils();

  const canSave =
    status === "DNF" || (status === "FINISHED" && rating !== null);

  const onSaveSuccess = () => {
    haptics.success();
    analytics.bookLogged(
      status?.toLowerCase() as "finished" | "dnf",
      rating !== null,
      word !== "",
    );
    utils.log.listMine.invalidate();
    utils.user.topBooksMine.invalidate();
    utils.user.myProfile.invalidate();
    router.back();
  };

  const createLog = trpc.log.create.useMutation({
    onSuccess: onSaveSuccess,
    onError: (error) => {
      haptics.error();
      Alert.alert("Error", error.message || "Failed to save log");
    },
  });

  const finishLog = trpc.log.finish.useMutation({
    onSuccess: onSaveSuccess,
    onError: (error) => {
      haptics.error();
      Alert.alert("Error", error.message || "Failed to finish reading");
    },
  });

  const isSubmitting = createLog.isPending || finishLog.isPending;

  const handleSave = () => {
    if (status === null) return;

    const baseData = {
      openLibraryId: params.openLibraryId,
      title: params.title,
      author: params.author || null,
      coverUrl: params.coverUrl || null,
    };

    if (isFinishMode) {
      if (!params.logId) {
        Alert.alert("Error", "Missing active reading log.");
        return;
      }

      if (status === "FINISHED") {
        finishLog.mutate({
          logId: params.logId,
          status: "FINISHED",
          rating: rating ?? 1,
          word: word.trim() || null,
          review: review.trim() || null,
        });
        return;
      }

      finishLog.mutate({
        logId: params.logId,
        status: "DNF",
        rating: null,
        word: word.trim() || null,
        review: review.trim() || null,
      });
      return;
    }

    if (status === "FINISHED") {
      createLog.mutate({
        ...baseData,
        status: "FINISHED",
        rating: rating ?? 1,
        word: word.trim() || null,
        review: review.trim() || null,
      });
      return;
    }

    createLog.mutate({
      ...baseData,
      status: "DNF",
      word: word.trim() || null,
      review: review.trim() || null,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
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
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <X size={24} color="$color12" />
          </Button>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            {isFinishMode ? "Finish Reading" : "Log Book"}
          </Text>
          <YStack width={40} />
        </XStack>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          backgroundColor="$background"
        >
          <XStack
            padding="$4"
            gap="$4"
            borderBottomWidth={1}
            borderColor="$color4"
          >
            <YStack
              borderRadius="$3"
              overflow="hidden"
              shadowColor="$color1"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
            >
              <Image
                src={
                  params.coverUrl ||
                  "https://placehold.co/80x120/1a1a2e/666666?text=No+Cover"
                }
                width={80}
                height={120}
                backgroundColor="$color2"
              />
            </YStack>
            <YStack flex={1} justifyContent="center" gap="$1">
              <Text
                fontSize="$5"
                fontWeight="600"
                color="$color12"
                numberOfLines={2}
              >
                {params.title}
              </Text>
              {params.author && (
                <Text fontSize="$3" color="$color11">
                  {params.author}
                </Text>
              )}
              {params.year && (
                <Text fontSize="$2" color="$color10">
                  {params.year}
                </Text>
              )}
            </YStack>
          </XStack>

          <YStack padding="$4" gap="$3">
            <Text fontSize="$3" fontWeight="600" color="$color12">
              STATUS
            </Text>
            <XStack gap="$3">
              <StatusButton
                label="Finished"
                selected={status === "FINISHED"}
                variant="finished"
                onPress={() => setStatus("FINISHED")}
              />
              <StatusButton
                label="DNF"
                selected={status === "DNF"}
                variant="dnf"
                onPress={() => setStatus("DNF")}
              />
            </XStack>
          </YStack>

          {status === "FINISHED" && (
            <YStack padding="$4" gap="$3">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                RATING
              </Text>
              <StarRating rating={rating} onRate={setRating} />
            </YStack>
          )}

          {(status === "FINISHED" || status === "DNF") && (
            <YStack padding="$4" gap="$3">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                DESCRIBE IN ONE WORD
              </Text>
              <Input
                value={word}
                onChangeText={(text) => setWord(text.replace(/\s/g, ""))}
                placeholder="sexy, spooky, nasty"
                size="$4"
                maxLength={30}
                autoCapitalize="none"
                backgroundColor="$color2"
                borderColor="$color4"
                borderWidth={1}
                color="$color12"
                placeholderTextColor="$color9"
                accessibilityLabel="Describe this book in one word"
                accessibilityHint="This word will appear in your profile word cloud"
              />
              <Text fontSize="$2" color="$color10">
                This word will appear in your profile's word cloud
              </Text>
            </YStack>
          )}

          {(status === "FINISHED" || status === "DNF") && (
            <YStack padding="$4" gap="$3">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                REVIEW
              </Text>
              <Input
                value={review}
                onChangeText={setReview}
                placeholder="What did you think?"
                size="$4"
                maxLength={1000}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                backgroundColor="$color2"
                borderColor="$color4"
                borderWidth={1}
                color="$color12"
                placeholderTextColor="$color9"
                minHeight={100}
                accessibilityLabel="Write a short review"
              />
              <Text fontSize="$2" color="$color10">
                {review.length}/1000
              </Text>
            </YStack>
          )}

          <YStack flex={1} minHeight={24} />

          <YStack padding="$4" paddingBottom={insets.bottom + 16}>
            <Button
              size="$5"
              theme={canSave ? "accent" : undefined}
              variant={canSave ? undefined : "outlined"}
              onPress={handleSave}
              disabled={!canSave || isSubmitting}
              opacity={!canSave || isSubmitting ? 0.6 : 1}
              accessibilityLabel={
                isSubmitting
                  ? isFinishMode
                    ? "Finishing reading"
                    : "Saving your log"
                  : isFinishMode
                    ? "Finish reading"
                    : "Save book log"
              }
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave || isSubmitting }}
            >
              <Button.Text fontWeight="700" fontSize="$5">
                {isSubmitting
                  ? isFinishMode
                    ? "Finishing..."
                    : "Saving..."
                  : isFinishMode
                    ? "Finish Reading"
                    : "Log Book"}
              </Button.Text>
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </KeyboardAvoidingView>
  );
}

function StarRating({
  rating,
  onRate,
}: {
  rating: number | null;
  onRate: (rating: number | null) => void;
}) {
  const theme = useTheme();
  const handleRate = (star: number) => {
    haptics.selection();
    onRate(rating === star ? null : star);
  };

  return (
    <XStack gap="$2" justifyContent="center" accessibilityRole="radiogroup">
      {[1, 2, 3, 4, 5, 6].map((star) => {
        const isActive = rating !== null && star <= rating;
        return (
          <Button
            key={star}
            size="$5"
            circular
            theme={isActive ? "star" : undefined}
            backgroundColor={isActive ? "$color3" : "$background"}
            borderColor={isActive ? "$color7" : "$color4"}
            borderWidth={1}
            pressStyle={{ opacity: 0.8, scale: 0.95 }}
            onPress={() => handleRate(star)}
            accessibilityLabel={`${star} star${star > 1 ? "s" : ""}`}
            accessibilityRole="radio"
            accessibilityState={{ checked: rating === star }}
          >
            <Star
              size={28}
              color={isActive ? "$color11" : "$color10"}
              fill={isActive ? theme.color11.get() : "transparent"}
            />
          </Button>
        );
      })}
    </XStack>
  );
}
