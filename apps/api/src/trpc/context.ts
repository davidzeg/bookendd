import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { verifyToken } from '@clerk/backend';

export async function createContext({ req }: CreateExpressContextOptions) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return { user: null };
  }

  try {
    const payload = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY!,
    });

    return { user: { clerkId: payload.sub } };
  } catch {
    return { user: null };
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>;
