import { useEffect } from "react";
import { YStack, YStackProps } from "tamagui";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

interface SkeletonBoxProps extends Omit<YStackProps, "children"> {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  shimmer?: boolean;
}

export function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  shimmer = true,
  ...props
}: SkeletonBoxProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    if (shimmer) {
      opacity.value = withRepeat(
        withTiming(0.7, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    }
  }, [shimmer, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedYStack
      backgroundColor="$color3"
      borderRadius={borderRadius}
      width={width}
      height={height}
      style={animatedStyle}
      {...props}
    />
  );
}
