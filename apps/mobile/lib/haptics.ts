import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Haptic feedback utilities for the app.
 * Provides platform-safe haptic feedback that silently fails on web.
 */
export const haptics = {
  /**
   * Light haptic feedback - use for subtle interactions like tab switches
   */
  light: () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  /**
   * Medium haptic feedback - use for standard button presses
   */
  medium: () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },

  /**
   * Heavy haptic feedback - use for important actions like saving
   */
  heavy: () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },

  /**
   * Selection feedback - use for picker/selection changes like star rating
   */
  selection: () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
  },

  /**
   * Success notification - use after successful actions like logging a book
   */
  success: () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },

  /**
   * Warning notification - use for warnings
   */
  warning: () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },

  /**
   * Error notification - use for errors
   */
  error: () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },
};
