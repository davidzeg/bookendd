import { Text, XStack, YStack } from "tamagui";
import { Search } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { haptics } from "@/lib/haptics";

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
          backgroundColor="$accent6"
          borderRadius={16}
          padding="$5"
          gap="$4"
          alignItems="center"
          justifyContent="center"
          opacity={pressed ? 0.9 : 1}
          style={{
            transform: [{ scale: pressed ? 0.98 : 1 }],
          }}
        >
          <YStack
            backgroundColor="$accent8"
            borderRadius={12}
            padding="$3"
          >
            <Search size={24} color="$color12" />
          </YStack>
          <YStack flex={1} gap="$1">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              Log a book
            </Text>
            <Text fontSize="$3" color="$accent11">
              Search and track what you've read
            </Text>
          </YStack>
        </XStack>
      )}
    </Pressable>
  );
}
