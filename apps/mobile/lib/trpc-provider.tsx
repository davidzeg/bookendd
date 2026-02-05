import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./trpc";
import { useState } from "react";
import { httpBatchLink } from "@trpc/client";
import { useAuth } from "@clerk/clerk-expo";
import { env } from "./env";

const getBaseUrl = () => {
  return env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";
};

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
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
            const token = await getToken();
            return {
              Authorization: token ? `Bearer ${token}` : "",
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
