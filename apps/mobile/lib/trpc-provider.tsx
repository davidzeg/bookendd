import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./trpc";
import { useEffect, useRef, useState } from "react";
import { httpBatchLink } from "@trpc/client";
import { useAuth } from "@clerk/clerk-expo";
import { env } from "./env";

const getBaseUrl = () => {
  return env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";
};

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn, isLoaded, userId } = useAuth();
  const authRef = useRef({
    isLoaded,
    isSignedIn,
    getToken,
  });

  useEffect(() => {
    authRef.current = {
      isLoaded,
      isSignedIn,
      getToken,
    };
  }, [isLoaded, isSignedIn, getToken]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          headers: async () => {
            const auth = authRef.current;
            if (!auth.isLoaded || !auth.isSignedIn) {
              return {};
            }

            let token: string | null = null;
            for (let attempt = 0; attempt < 3; attempt += 1) {
              token = await auth.getToken();
              if (token) break;
              if (attempt < 2) {
                await new Promise((resolve) =>
                  setTimeout(resolve, 100 * (attempt + 1)),
                );
              }
            }

            if (!token) {
              return {};
            }

            return {
              Authorization: `Bearer ${token}`,
            };
          },
        }),
      ],
    }),
  );
  const principalRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const principal = isSignedIn ? (userId ?? null) : null;

    if (principalRef.current === undefined) {
      principalRef.current = principal;
      return;
    }

    if (principalRef.current !== principal) {
      queryClient.clear();
      principalRef.current = principal;
    }
  }, [isSignedIn, userId, queryClient]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
