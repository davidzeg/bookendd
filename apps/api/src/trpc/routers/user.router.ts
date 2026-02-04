import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

const bookSelect = {
  id: true,
  title: true,
  author: true,
  coverUrl: true,
} as const;

type BookShape = {
  id: string;
  title: string;
  author: string | null;
  coverUrl: string | null;
};

async function getTopBooksForUser(prisma: PrismaClient, userId: string) {
  // Check for explicit top books first
  const explicitTopBooks = await prisma.userTopBook.findMany({
    where: { userId },
    select: {
      id: true,
      position: true,
      book: { select: bookSelect },
    },
    orderBy: { position: 'asc' },
  });

  if (explicitTopBooks.length > 0) {
    return {
      books: explicitTopBooks as {
        id: string;
        position: number;
        book: BookShape;
      }[],
      isExplicit: true,
    };
  }

  // Derive from highest-rated logs
  const highRatedLogs = await prisma.log.findMany({
    where: {
      userId,
      rating: { gte: 5 },
      isQuickAdd: false,
    },
    select: {
      id: true,
      book: { select: bookSelect },
    },
    orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
    take: 6,
  });

  return {
    books: highRatedLogs.map((log, index) => ({
      id: log.id,
      position: index + 1,
      book: log.book as BookShape,
    })),
    isExplicit: false,
  };
}

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
    return getTopBooksForUser(ctx.prisma, ctx.user.id);
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

      const topBooksResult = await getTopBooksForUser(ctx.prisma, user.id);

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
        topBooks: topBooksResult.books,
        recentLogs,
        words,
      };
    }),
});
