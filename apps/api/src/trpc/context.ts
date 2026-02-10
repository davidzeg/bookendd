import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { verifyToken } from '@clerk/backend';
import { env } from '../env';
import { PrismaService } from '../prisma/prisma.service';

export type AuthUser = {
  id: string;
  clerkId: string;
};

export function createContextFactory(prisma: PrismaService) {
  return async function createContext({ req }: CreateExpressContextOptions) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return { user: null, clerkId: null, prisma };
    }

    try {
      const payload = await verifyToken(token, {
        jwtKey: env.CLERK_JWT_KEY,
        authorizedParties: env.CLERK_AUTHORIZED_PARTIES,
        clockSkewInMs: 60000,
      });

      const dbUser = await prisma.user.findUnique({
        where: { clerkId: payload.sub },
        select: { id: true, clerkId: true },
      });

      return {
        user: dbUser,
        clerkId: payload.sub,
        prisma,
      };
    } catch {
      return { user: null, clerkId: null, prisma };
    }
  };
}

export type Context = Awaited<
  ReturnType<ReturnType<typeof createContextFactory>>
>;
