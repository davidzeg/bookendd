import { z } from 'zod';
import {
  clerkAuthProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from '../trpc';
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
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { favoritesMode: true },
  });

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

  if (user?.favoritesMode === 'manual') {
    return {
      books: [],
      isExplicit: true,
    };
  }

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

  // Fallback for when Clerk webhook hasn't fired yet — creates user from JWT
  ensureMe: clerkAuthProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.upsert({
      where: { clerkId: ctx.clerkId },
      create: {
        clerkId: ctx.clerkId,
        username: `reader_${ctx.clerkId.slice(-8)}`,
      },
      update: {},
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

  myProfile: protectedProcedure.query(async ({ ctx }) => {
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

    if (!user) return null;

    const topBooksResult = await getTopBooksForUser(ctx.prisma, user.id);

    const recentLogs = await ctx.prisma.log.findMany({
      where: { userId: user.id, isQuickAdd: false },
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

  topBooksMine: protectedProcedure.query(async ({ ctx }) => {
    return getTopBooksForUser(ctx.prisma, ctx.user.id);
  }),

  byUsername: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(1)
          .max(30)
          .regex(/^[a-zA-Z0-9_]+$/, 'Invalid username format'),
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
        where: { userId: user.id, isQuickAdd: false },
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

  setFavorites: protectedProcedure
    .input(
      z.object({
        favorites: z.array(
          z.object({
            bookId: z.string(),
            position: z.number().int().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { favorites } = input;

      const positions = favorites.map((f) => f.position);
      if (new Set(positions).size !== positions.length) {
        throw new Error('Duplicate positions not allowed');
      }

      const bookIds = favorites.map((f) => f.bookId);
      if (new Set(bookIds).size !== bookIds.length) {
        throw new Error('Duplicate books not allowed');
      }

      await ctx.prisma.$transaction(async (tx) => {
        await tx.userTopBook.deleteMany({
          where: { userId: ctx.user.id },
        });

        if (favorites.length > 0) {
          await tx.userTopBook.createMany({
            data: favorites.map((f) => ({
              userId: ctx.user.id,
              bookId: f.bookId,
              position: f.position,
            })),
          });
        }

        await tx.user.update({
          where: { id: ctx.user.id },
          data: { favoritesMode: 'manual' },
        });
      });

      return getTopBooksForUser(ctx.prisma, ctx.user.id);
    }),

  exportMyData: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        favoritesMode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const logs = await ctx.prisma.log.findMany({
      where: { userId: ctx.user.id },
      include: { book: true },
      orderBy: { createdAt: 'desc' },
    });

    const topBooks = await ctx.prisma.userTopBook.findMany({
      where: { userId: ctx.user.id },
      include: { book: true },
      orderBy: { position: 'asc' },
    });

    return {
      exportedAt: new Date().toISOString(),
      user,
      logs: logs.map((log) => ({
        id: log.id,
        status: log.status,
        rating: log.rating,
        word: log.word,
        readNumber: log.readNumber,
        finishedAt: log.finishedAt,
        isQuickAdd: log.isQuickAdd,
        createdAt: log.createdAt,
        book: {
          title: log.book.title,
          author: log.book.author,
          openLibraryId: log.book.openLibraryId,
        },
      })),
      topBooks: topBooks.map((tb) => ({
        position: tb.position,
        book: {
          title: tb.book.title,
          author: tb.book.author,
          openLibraryId: tb.book.openLibraryId,
        },
      })),
    };
  }),

  deleteMyAccount: protectedProcedure.mutation(async ({ ctx }) => {
    // Prisma cascade deletes handle Log and UserTopBook records
    await ctx.prisma.user.delete({
      where: { id: ctx.user.id },
    });

    return { deleted: true };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        bio: z.string().max(500).optional(),
        avatarUrl: z.url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.bio !== undefined && { bio: input.bio }),
          ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
        },
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          bio: true,
        },
      });

      return user;
    }),
});
