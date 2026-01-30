import { protectedProcedure, publicProcedure, router } from '../trpc';

export const healthRouter = router({
  check: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  authTest: protectedProcedure.query(({ ctx }) => {
    return {
      message: 'You are authenticated',
      clerkId: ctx.user.clerkId,
    };
  }),
});
