import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

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
        createdAt: true,
      },
    });

    return user;
  }),

  topBooksMine: protectedProcedure.query(async ({ ctx }) => {
    const topBooks = await ctx.prisma.userTopBook.findMany({
      where: { userId: ctx.user.id },
      include: { book: true },
      orderBy: { position: 'asc' },
    });

    return topBooks;
  }),

  byUsername: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          bio: true,
          createdAt: true,
        },
      });

      if (!user) return null;

      const topBooks = await ctx.prisma.userTopBook.findMany({
        where: { userId: user.id },
        include: { book: true },
        orderBy: { position: 'asc' },
      });

      const recentLogs = await ctx.prisma.log.findMany({
        where: { userId: user.id },
        include: { book: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      const wordCloudData = await ctx.prisma.log.groupBy({
        by: ['word'],
        where: {
          userId: user.id,
          word: { not: null },
        },
        _count: { word: true },
      });

      const words = wordCloudData
        .filter((w) => w.word !== null)
        .map((w) => ({
          word: w.word as string,
          count: w._count.word,
        }));

      return {
        user,
        topBooks,
        recentLogs,
        words,
      };
    }),
});
