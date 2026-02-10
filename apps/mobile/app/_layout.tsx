import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { isRunningInExpoGo } from "expo";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "react-native";
import { Spinner, TamaguiProvider, YStack, Text } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";
import { TRPCProvider } from "@/lib/trpc-provider";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@/lib/clerk";
import { env } from "@/lib/env";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";
import { analytics } from "@/lib/posthog";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

if (env.EXPO_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: env.EXPO_PUBLIC_SENTRY_DSN,
    environment: __DEV__ ? "development" : "production",
    tracesSampleRate: 0.1,
    integrations: [navigationIntegration],
    enableNativeFramesTracking: !isRunningInExpoGo(),
  });
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      defaultTheme={colorScheme ?? "dark"}
    >
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      >
        <TRPCProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <AuthGate />
          </ThemeProvider>
        </TRPCProvider>
      </ClerkProvider>
    </TamaguiProvider>
  );
}

export default Sentry.wrap(RootLayout);

function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const userQuery = trpc.user.me.useQuery(undefined, {
    enabled: isLoaded === true && isSignedIn === true,
    staleTime: 0,
    refetchOnMount: "always",
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  const ensureMeMutation = trpc.user.ensureMe.useMutation({
    onSuccess: () => {
      userQuery.refetch();
    },
  });

  // Auto-trigger ensureMe when user.me returns null (webhook hasn't fired yet)
  useEffect(() => {
    if (
      isLoaded &&
      isSignedIn &&
      userQuery.isFetched &&
      !userQuery.isLoading &&
      !userQuery.data &&
      !userQuery.error &&
      !userQuery.isRefetching &&
      !ensureMeMutation.isPending &&
      !ensureMeMutation.isSuccess &&
      !ensureMeMutation.isError
    ) {
      ensureMeMutation.mutate();
    }
  }, [
    isLoaded,
    isSignedIn,
    userQuery.isFetched,
    userQuery.isLoading,
    userQuery.data,
    userQuery.error,
    userQuery.isRefetching,
    ensureMeMutation.isPending,
    ensureMeMutation.isSuccess,
    ensureMeMutation.isError,
  ]);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isSignedIn) {
      if (!inAuthGroup) {
        router.replace("/(auth)/sign-in");
      }
      return;
    }

    if (userQuery.isLoading) return;

    if (userQuery.data) {
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [isSignedIn, isLoaded, segments, userQuery.isLoading, userQuery.data]);

  useEffect(() => {
    if (userQuery.data) {
      analytics.identify(userQuery.data.id, {
        username: userQuery.data.username,
      });
      analytics.authSuccess();
      Sentry.setUser({
        id: userQuery.data.id,
        username: userQuery.data.username,
      });
    }
  }, [userQuery.data]);

  if (!isLoaded) {
    return null;
  }

  if (
    isSignedIn &&
    (userQuery.isLoading || ensureMeMutation.isPending)
  ) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
        gap="$3"
      >
        <Spinner size="large" color="$accent10" />
        <Text color="$color11" textAlign="center">
          Setting up your account...
        </Text>
      </YStack>
    );
  }

  if (isSignedIn && !userQuery.data) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
        padding="$6"
        gap="$3"
      >
        <Text fontSize="$5" color="$color12" textAlign="center">
          Something went wrong
        </Text>
        <Text fontSize="$2" color="$color10" textAlign="center">
          We couldn't set up your account. Please try again.
        </Text>
        <Button
          marginTop="$2"
          size="$3"
          variant="outlined"
          onPress={() => {
            ensureMeMutation.reset();
            userQuery.refetch();
          }}
        >
          <Button.Text>Retry</Button.Text>
        </Button>
      </YStack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="book/[openLibraryId]" />
      <Stack.Screen name="log-book" options={{ presentation: "modal" }} />
    </Stack>
  );
}
