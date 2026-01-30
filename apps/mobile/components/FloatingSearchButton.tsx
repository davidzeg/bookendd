import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { GlassContainer } from "./ui/GlassContainer";

export function FloatingSearchButton() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <GlassContainer
      style={[styles.container, { bottom: insets.bottom + 16 }]}
      borderRadius={28}
    >
      <Pressable
        onPress={() => router.push("/search")}
        style={styles.button}
        android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
      >
        {({ pressed }) => (
          <Search
            size={24}
            color="$gray12"
            style={{ opacity: pressed ? 0.6 : 1 }}
          />
        )}
      </Pressable>
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    width: 56,
    height: 56,
  },
  button: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
});
