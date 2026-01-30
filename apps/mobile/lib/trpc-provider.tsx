import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./trpc";
import { useState } from "react";
import { httpBatchLink } from "@trpc/client";
import { useAuth } from "@clerk/clerk-expo";

const getBaseUrl = () => {
  // TODO: add production url
  return "http://192.168.100.72:3001";
};

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());
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
