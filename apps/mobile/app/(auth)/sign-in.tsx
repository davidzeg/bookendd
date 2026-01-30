import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useSSO } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { Button, Text, XStack, YStack } from "tamagui";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { startSSOFlow } = useSSO();

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const handleOAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    try {
      const redirectUrl = Linking.createURL("/(auth)/sign-in");

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.error(`${strategy} error:`, error);
    }
  };
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$6"
      gap="$4"
    >
      <Text fontSize="$8" fontWeight="bold" marginBottom="$6">
        Welcome to Bookendd
      </Text>

      <Button
        size="$5"
        width="100%"
        onPress={() => handleOAuth("oauth_google")}
      >
        Continue with Google
      </Button>

      <Button
        size="$5"
        width="100%"
        onPress={() => handleOAuth("oauth_apple")}
        backgroundColor="$gray12"
        color="$gray1"
      >
        Continue with Apple
      </Button>

      <XStack marginTop="$4" gap="$2">
        <Text color="$gray11">First time here?</Text>
        <Text color="blue10">Signing in creates your account</Text>
      </XStack>
    </YStack>
  );
}
