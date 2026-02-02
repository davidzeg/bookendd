import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, Text, XStack, YStack, Input, ScrollView } from "tamagui";
import { Star, X } from "@tamagui/lucide-icons";
import { Button } from "@/components/ui/Button";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { trpc } from "@/lib/trpc";

type LogStatus = "FINISHED" | "DNF" | null;

export default function LogBookModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    openLibraryId: string;
    title: string;
    author: string;
    coverUrl: string;
    year: string;
  }>();

  const [status, setStatus] = useState<LogStatus>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [word, setWord] = useState("");

  console.log("Book params:", params);

  const canSave =
    status === "DNF" || (status === "FINISHED" && rating !== null);

  const createLog = trpc.log.create.useMutation({
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to save log");
    },
  });

  const handleSave = () => {
    if (status === null) return;

    const baseData = {
      openLibraryId: params.openLibraryId,
      title: params.title,
      author: params.author || null,
      coverUrl: params.coverUrl || null,
    };

    if (status === "FINISHED") {
      createLog.mutate({
        ...baseData,
        status: "FINISHED",
        rating: rating ?? 1,
        word: word.trim() || null,
      });
    } else {
      createLog.mutate({
        ...baseData,
        status: "DNF",
        word: word.trim() || null,
      });
    }
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
          <Button size="$3" circular chromeless onPress={() => router.back()}>
            <X size={24} color="$gray12" />
          </Button>
          <Text fontSize="$5" fontWeight="600">
            Log Book
          </Text>
          <YStack width={40} />
        </XStack>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <XStack
            padding="$4"
            gap="$4"
            borderBottomWidth={1}
            borderColor="$gray4"
          >
            <Image
              src={
                params.coverUrl ||
                "https://placehold.co/80x120/1a1a2e/666666?text=No+Cover"
              }
              width={80}
              height={120}
              borderRadius="$3"
              backgroundColor="$gray5"
            />
            <YStack flex={1} justifyContent="center" gap="$1">
              <Text fontSize="$5" fontWeight="600" numberOfLines={2}>
                {params.title}
              </Text>
              {params.author && (
                <Text fontSize="$3" color="$gray11">
                  {params.author}
                </Text>
              )}
              {params.year && (
                <Text fontSize="$2" color="$gray10">
                  {params.year}
                </Text>
              )}
            </YStack>
          </XStack>

          <YStack padding="$4" gap="$3">
            <Text fontSize="$3" fontWeight="600" color="$gray11">
              STATUS
            </Text>
            <XStack gap="$3">
              <StatusButton
                label="Finished"
                selected={status === "FINISHED"}
                onPress={() => setStatus("FINISHED")}
              />
              <StatusButton
                label="DNF"
                selected={status === "DNF"}
                onPress={() => setStatus("DNF")}
              />
            </XStack>
          </YStack>

          {status === "FINISHED" && (
            <YStack padding="$4" gap="$3">
              <Text fontSize="$3" fontWeight="600" color="$gray11">
                RATING
              </Text>
              <StarRating rating={rating} onRate={setRating} />
            </YStack>
          )}

          {status !== null && (
            <YStack padding="$4" gap="$3">
              <Text fontSize="$3" fontWeight="600" color="$gray11">
                DESCRIBE IN ONE WORD
              </Text>
              <Input
                value={word}
                onChangeText={(text) => setWord(text.replace(/\s/g, ""))}
                placeholder="sexy, spooky, nasty"
                placeholderTextColor="$gray9"
                backgroundColor="$gray3"
                borderWidth={0}
                size="$4"
                maxLength={30}
                autoCapitalize="none"
              />
              <Text fontSize="$2" color="$gray9">
                This word will appear in your profile's word cloud
              </Text>
            </YStack>
          )}

          <YStack flex={1} minHeight={24} />

          <YStack padding="$4" paddingBottom={insets.bottom + 16}>
            <Button
              size="$5"
              backgroundColor={canSave ? "$blue10" : "$gray5"}
              onPress={handleSave}
              disabled={!canSave || createLog.isPending}
              opacity={createLog.isPending ? 0.7 : 1}
            >
              <Text
                color={canSave ? "white" : "$gray9"}
                fontWeight="700"
                fontSize="$5"
              >
                {createLog.isPending ? "Saving..." : "Log Book"}
              </Text>
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </KeyboardAvoidingView>
  );
}

function StatusButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      flex={1}
      size="$5"
      backgroundColor={selected ? "$blue5" : "$gray3"}
      borderWidth={2}
      borderColor={selected ? "$blue10" : "$gray3"}
      pressStyle={{ opacity: 0.8 }}
      onPress={onPress}
    >
      <Text
        color={selected ? "$blue10" : "$gray11"}
        fontWeight={selected ? "700" : "500"}
        fontSize="$4"
      >
        {label}
      </Text>
    </Button>
  );
}

function StarRating({
  rating,
  onRate,
}: {
  rating: number | null;
  onRate: (rating: number | null) => void;
}) {
  return (
    <XStack gap="$2" justifyContent="center">
      {[1, 2, 3, 4, 5, 6].map((star) => {
        const isActive = rating !== null && star <= rating;
        return (
          <Button
            key={star}
            size="$5"
            circular
            backgroundColor={isActive ? "$yellow5" : "$gray3"}
            pressStyle={{ opacity: 0.8, scale: 0.95 }}
            onPress={() => onRate(rating === star ? null : star)}
          >
            <Star
              size={28}
              fill={isActive ? "#eab308" : "transparent"}
              color={isActive ? "#eab308" : "$gray8"}
            />
          </Button>
        );
      })}
    </XStack>
  );
}
