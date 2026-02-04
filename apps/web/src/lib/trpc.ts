import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@bookendd/api/src/trpc/routers";

function getBaseUrl() {
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  // Default to localhost in development
  return "http://localhost:3001";
}

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});
