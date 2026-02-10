import { initTRPC, TRPCError } from '@trpc/server';
import * as Sentry from '@sentry/nestjs';
import { Context } from './context';

export const t = initTRPC.context<Context>().create();

const sentryMiddleWare = t.middleware(
  Sentry.trpcMiddleware({
    attachRpcInput: true,
  }),
);

export const router = t.router;
const baseProcedure = t.procedure.use(sentryMiddleWare);
export const publicProcedure = baseProcedure;

export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
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
