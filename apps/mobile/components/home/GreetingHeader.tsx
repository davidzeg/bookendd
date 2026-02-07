import { Text, YStack, useTheme } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";

interface GreetingHeaderProps {
  name?: string | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function GreetingHeader({ name }: GreetingHeaderProps) {
  const greeting = getGreeting();
  const displayName = name || "reader";
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.color2.get(), theme.background.get()]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ borderRadius: 16, padding: 20 }}
    >
      <YStack gap="$2">
        <Text fontSize="$4" color="$color10" fontWeight="500">
          {greeting},
        </Text>
        <Text
          fontSize="$8"
          fontWeight="700"
          color="$color12"
          style={{ letterSpacing: -0.5 }}
        >
          {displayName}
        </Text>
      </YStack>
    </LinearGradient>
  );
}
