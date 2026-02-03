import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useSignIn, useSignUp, useSSO } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  Input,
  ScrollView,
  Spinner,
  Text,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Button } from "@/components/ui/Button";

type ClerkError = {
  errors?: Array<{
    code: string;
    message: string;
  }>;
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { startSSOFlow } = useSSO();
  const {
    signIn,
    setActive: setSignInActive,
    isLoaded: isSignInLoaded,
  } = useSignIn();
  const {
    signUp,
    setActive: setSignUpActive,
    isLoaded: isSignUpLoaded,
  } = useSignUp();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [isAwaitingCode, setIsAwaitingCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [flowType, setFlowType] = useState<"signIn" | "signUp" | null>(null);

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const handleEmailSubmit = async () => {
    if (!isSignInLoaded || !isSignUpLoaded || !signIn || !signUp) return;

    setError(null);
    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
      });

      const emailCodeFactor = signInAttempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor && "emailAddressId" in emailCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        setFlowType("signIn");
        setIsAwaitingCode(true);
      }
    } catch (err) {
      const clerkError = err as ClerkError;
      if (clerkError.errors?.[0]?.code === "form_identifier_not_found") {
        try {
          await signUp.create({
            emailAddress: email,
          });
          await signUp.prepareEmailAddressVerification();
          setFlowType("signUp");
          setIsAwaitingCode(true);
        } catch (signUpErr) {
          const signUpClerkErr = signUpErr as ClerkError;
          setError(
            signUpClerkErr.errors?.[0]?.message || "Failed to send code",
          );
        }
      } else {
        setError(clerkError.errors?.[0]?.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (!signIn || !signUp) return;

    setError(null);
    setIsLoading(true);

    try {
      if (flowType === "signIn") {
        const result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });

        if (result.status === "complete" && setSignInActive) {
          await setSignInActive({ session: result.createdSessionId });
        }
      } else if (flowType === "signUp") {
        const result = await signUp.attemptEmailAddressVerification({ code });

        if (result.status === "complete" && setSignUpActive) {
          await setSignUpActive({ session: result.createdSessionId });
        }
      }
    } catch (err) {
      const clerkError = err as ClerkError;
      setError(clerkError.errors?.[0]?.message || "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleBack = () => {
    setIsAwaitingCode(false);
    setCode("");
    setError(null);
    setFlowType(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        backgroundColor="$background"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$6"
          gap="$4"
          backgroundColor="$background"
        >
          <YStack width="100%" maxWidth={340} gap="$4">
            <Text
              fontSize="$8"
              fontWeight="bold"
              textAlign="center"
              marginBottom="$4"
            >
              Welcome to dBOOKENDb
            </Text>

            {error && (
              <Theme name="error">
                <YStack
                  backgroundColor="$background"
                  borderColor="$borderColor"
                  borderWidth={1}
                  padding="$3"
                  borderRadius="$2"
                >
                  <Text color="$color">{error}</Text>
                </YStack>
              </Theme>
            )}

            {!isAwaitingCode ? (
              <>
                <Input
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  size="$5"
                  width="100%"
                />

                <Button
                  theme="accent"
                  size="$5"
                  width="100%"
                  onPress={handleEmailSubmit}
                  disabled={!email || isLoading}
                  opacity={!email || isLoading ? 0.5 : 1}
                >
                  {isLoading ? <Spinner /> : "Continue with Email"}
                </Button>

                <XStack alignItems="center" gap="$3" marginVertical="$1">
                  <YStack flex={1} height={1} backgroundColor="$borderColor" />
                  <Text color="$color11" fontSize="$2">
                    or
                  </Text>
                  <YStack flex={1} height={1} backgroundColor="$borderColor" />
                </XStack>

                <Button
                  size="$5"
                  width="100%"
                  onPress={() => handleOAuth("oauth_google")}
                  variant="outlined"
                >
                  Continue with Google
                </Button>

                <Theme name="dark">
                  <Button
                    size="$5"
                    width="100%"
                    onPress={() => handleOAuth("oauth_apple")}
                  >
                    Continue with Apple
                  </Button>
                </Theme>
              </>
            ) : (
              <>
                <Text textAlign="center" color="$color11" marginBottom="$2">
                  We sent a code to {email}
                </Text>

                <Input
                  placeholder="000000"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  textAlign="center"
                  maxLength={6}
                  size="$5"
                  width="100%"
                  fontSize="$7"
                  letterSpacing={8}
                  fontWeight="600"
                />

                <Button
                  theme="accent"
                  size="$5"
                  onPress={handleCodeSubmit}
                  disabled={code.length !== 6 || isLoading}
                  opacity={code.length !== 6 || isLoading ? 0.5 : 1}
                >
                  {isLoading ? <Spinner /> : "Verify"}
                </Button>

                <Button
                  size="$5"
                  variant="outlined"
                  onPress={handleBack}
                  width="100%"
                >
                  Use a different email
                </Button>
              </>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
