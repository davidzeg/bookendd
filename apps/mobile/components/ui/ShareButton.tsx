import { Share, Platform } from "react-native";
import { Text, XStack } from "tamagui";
import { Share2 } from "@tamagui/lucide-icons";
import { Button } from "./Button";
import { haptics } from "@/lib/haptics";
import { analytics } from "@/lib/posthog";

interface ShareButtonProps {
  url: string;
  title?: string;
  message?: string;
}

export function ShareButton({ url, title, message }: ShareButtonProps) {
  const handleShare = async () => {
    haptics.light();
    try {
      const result = await Share.share(
        Platform.select({
          ios: {
            url,
            message: message || title,
          },
          android: {
            message: message ? `${message}\n${url}` : url,
            title,
          },
          default: {
            message: url,
          },
        })!
      );
      if (result.action === Share.sharedAction) {
        analytics.profileShared(result.activityType ?? "unknown");
      }
    } catch (error) {
      // User cancelled or error - silently ignore
    }
  };

  return (
    <Button
      size="$3"
      variant="outlined"
      borderColor="$color6"
      onPress={handleShare}
    >
      <XStack gap="$2" alignItems="center">
        <Share2 size={16} color="$color11" />
        <Text color="$color11" fontWeight="500">
          Share
        </Text>
      </XStack>
    </Button>
  );
}
