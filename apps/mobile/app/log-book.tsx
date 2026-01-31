import { X } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Image, Text, XStack, YStack } from "tamagui";

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

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        <Text fontSize="$6" fontWeight="700">
          Log Book
        </Text>
        <Button size="$3" circular chromeless onPress={() => router.back()}>
          <X size={24} color="$gray12" />
        </Button>
      </XStack>

      <XStack padding="$4" gap="$4">
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
          <Text fontSize="$6" fontWeight="600" numberOfLines={2}>
            {params.title}
          </Text>
          {params.author && (
            <Text fontSize="$4" color="$gray11">
              {params.author}
            </Text>
          )}
          {params.year && (
            <Text fontSize="$3" color="$gray10">
              {params.year}
            </Text>
          )}
        </YStack>
      </XStack>

      {/* TODO: Log form will go here  */}
      <YStack flex={1} padding="$4">
        <Text color="$gray10">Form coming next</Text>
      </YStack>
    </YStack>
  );
}
