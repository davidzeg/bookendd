import { protectedProcedure, router } from '../trpc';

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        topBooks: true,
        createdAt: true,
      },
    });

    return user;
  }),
});
