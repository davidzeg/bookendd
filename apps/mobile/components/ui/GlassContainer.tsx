import { ReactNode } from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { BlurView } from "expo-blur";
import { YStack } from "tamagui";

interface GlassContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  borderRadius?: number;
}

export function GlassContainer({
  children,
  style,
  intensity = 80,
  borderRadius = 20,
}: GlassContainerProps) {
  const isIOS = Platform.OS === "ios";
  const hasLiquidGlass = isIOS && isLiquidGlassAvailable();

  if (hasLiquidGlass) {
    return (
      <GlassView
        style={[{ borderRadius, overflow: "hidden" }, style]}
        glassEffectStyle="regular"
      >
        {children}
      </GlassView>
    );
  }

  if (isIOS) {
    return (
      <BlurView
        intensity={intensity}
        tint="systemChromeMaterial"
        style={[{ borderRadius, overflow: "hidden" }, style]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <YStack
      backgroundColor="$background"
      borderRadius={borderRadius}
      elevation={8}
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.15}
      shadowRadius={12}
      style={style}
    >
      {children}
    </YStack>
  );
}
