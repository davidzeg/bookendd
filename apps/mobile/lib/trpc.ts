import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@bookendd/api";

export const trpc = createTRPCReact<AppRouter>();
