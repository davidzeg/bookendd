import { Text, XStack, YStack } from "tamagui";
import { Search } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { haptics } from "@/lib/haptics";
import { RADIUS_LG, RADIUS_MD, SHADOW_CARD } from "@/components/ui/tokens";

export function SearchCTA() {
  const router = useRouter();

  const handlePress = () => {
    haptics.light();
    router.push("/(tabs)/search");
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel="Log a book — search and track what you've read"
      accessibilityRole="button"
    >
      {({ pressed }) => (
        <XStack
          backgroundColor="$accent7"
          borderRadius={RADIUS_LG}
          padding="$5"
          gap="$4"
          alignItems="center"
          justifyContent="center"
          opacity={pressed ? 0.9 : 1}
          style={[
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
            SHADOW_CARD,
          ]}
        >
          <YStack
            backgroundColor="$accent9"
            borderRadius={RADIUS_MD}
            padding="$3"
          >
            <Search size={24} color="$color12" />
          </YStack>
          <YStack flex={1} gap="$1">
            <Text fontSize="$6" fontWeight="700" color="$color12">
              Log a book
            </Text>
            <Text fontSize="$3" color="$accent12" opacity={0.7}>
              Search and track what you've read
            </Text>
          </YStack>
        </XStack>
      )}
    </Pressable>
  );
}
