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
            <X size={24} color="$color12" />
          </Button>
          <Text fontSize="$5" fontWeight="600">
            Log Book
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
            borderColor="$borderColor"
          >
            <Image
              src={
                params.coverUrl ||
                "https://placehold.co/80x120/1a1a2e/666666?text=No+Cover"
              }
              width={80}
              height={120}
              borderRadius="$3"
              backgroundColor="$color2"
            />
            <YStack flex={1} justifyContent="center" gap="$1">
              <Text fontSize="$5" fontWeight="600" numberOfLines={2}>
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
            <Text fontSize="$3" fontWeight="600" color="$color11">
              STATUS
            </Text>
            <XStack gap="$3">
              <StatusButton
                label="Finished"
                selected={status === "FINISHED"}
                themeName="success"
                onPress={() => setStatus("FINISHED")}
              />
              <StatusButton
                label="DNF"
                selected={status === "DNF"}
                themeName="error"
                onPress={() => setStatus("DNF")}
              />
            </XStack>
          </YStack>

          {status === "FINISHED" && (
            <YStack padding="$4" gap="$3">
              <Text fontSize="$3" fontWeight="600" color="$color11">
                RATING
              </Text>
              <StarRating rating={rating} onRate={setRating} />
            </YStack>
          )}

          {status !== null && (
            <YStack padding="$4" gap="$3">
              <Text fontSize="$3" fontWeight="600" color="$color11">
                DESCRIBE IN ONE WORD
              </Text>
              <Input
                value={word}
                onChangeText={(text) => setWord(text.replace(/\s/g, ""))}
                placeholder="sexy, spooky, nasty"
                size="$4"
                maxLength={30}
                autoCapitalize="none"
              />
              <Text fontSize="$2" color="$color10">
                This word will appear in your profile's word cloud
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
              disabled={!canSave || createLog.isPending}
              opacity={!canSave || createLog.isPending ? 0.6 : 1}
            >
              <Button.Text fontWeight="700" fontSize="$5">
                {createLog.isPending ? "Saving..." : "Log Book"}
              </Button.Text>
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
  themeName,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  themeName: "success" | "error";
}) {
  return (
    <Button
      flex={1}
      size="$5"
      theme={selected ? themeName : undefined}
      variant={selected ? undefined : "outlined"}
      pressStyle={{ opacity: 0.8 }}
      onPress={onPress}
    >
      <Button.Text fontWeight={selected ? "700" : "500"} fontSize="$4">
        {label}
      </Button.Text>
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
            theme={isActive ? "star" : undefined}
            backgroundColor={isActive ? "$color3" : "$background"}
            borderColor={isActive ? "$color7" : "$borderColor"}
            borderWidth={1}
            pressStyle={{ opacity: 0.8, scale: 0.95 }}
            onPress={() => onRate(rating === star ? null : star)}
          >
            <Star
              size={28}
              color={isActive ? "$color11" : "$color10"}
            />
          </Button>
        );
      })}
    </XStack>
  );
}
