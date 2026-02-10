import { initTRPC, TRPCError } from '@trpc/server';
import * as Sentry from '@sentry/nestjs';
import { Context } from './context';
import { ensureUserForClerkId } from './ensure-user';

export const t = initTRPC.context<Context>().create();

const sentryMiddleWare = t.middleware(
  Sentry.trpcMiddleware({
    attachRpcInput: true,
  }),
);

export const router = t.router;
const baseProcedure = t.procedure.use(sentryMiddleWare);
export const publicProcedure = baseProcedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (ctx.user) {
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }

  if (!ctx.clerkId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const ensuredUser = await ensureUserForClerkId(ctx.prisma, ctx.clerkId);

  return next({
    ctx: {
      ...ctx,
      user: {
        id: ensuredUser.id,
        clerkId: ensuredUser.clerkId,
      },
    },
  });
});

// Requires valid JWT (clerkId) but does NOT require a DB user row.
// Used for ensureMe — the fallback that creates the user if webhook hasn't fired.
export const clerkAuthProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.clerkId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      clerkId: ctx.clerkId,
    },
  });
});
