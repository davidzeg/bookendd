import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { moderateText } from '../../lib/moderation';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';

const bookDataSchema = z.object({
  openLibraryId: z
    .string()
    .min(1)
    .refine((id) => id.startsWith('/works/'), {
      message: 'Must be an OpenLibrary work ID (e.g., /works/OL123W)',
    }),
  title: z.string().min(1).max(500),
  author: z.string().max(500).nullable(),
  coverUrl: z.url().nullable(),
});

const wordSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((w) => w.length <= 30, 'Word must be 30 characters or fewer')
  .refine((w) => !/\s/.test(w), 'Must be a single word (no spaces)');

const finishedLogSchema = z.object({
  status: z.literal('FINISHED'),
  rating: z.number().int().min(1).max(6),
  word: wordSchema.nullable(),
  review: z.string().max(5000).nullable(),
  finishedAt: z.coerce.date().optional(),
  startedAt: z.coerce.date().optional(),
});

const dnfLogSchema = z.object({
  status: z.literal('DNF'),
  rating: z.null().optional(),
  word: wordSchema.nullable(),
  review: z.string().max(5000).nullable(),
  dnfReason: z.string().trim().max(500).nullable().optional(),
  dnfProgress: z.string().trim().max(50).nullable().optional(),
  finishedAt: z.coerce.date().optional(),
  startedAt: z.coerce.date().optional(),
});

const readingLogSchema = z.object({
  status: z.literal('READING'),
  rating: z.null().optional(),
  word: z.null().optional(),
  review: z.null().optional(),
  startedAt: z.coerce.date().optional(),
  finishedAt: z.null().optional(),
});

const logDataSchema = z.discriminatedUnion('status', [
  finishedLogSchema,
  dnfLogSchema,
  readingLogSchema,
]);

const createLogInputSchema = z.intersection(bookDataSchema, logDataSchema);

function isReadNumberUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

export const logRouter = router({
  create: protectedProcedure
    .input(createLogInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.word) {
        const moderation = await moderateText(input.word);
        if (moderation.flagged) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Please choose a different word',
          });
        }
      }

      if (input.review) {
        const moderation = await moderateText(input.review);
        if (moderation.flagged) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Your review contains content that is not allowed. Please revise.',
          });
        }
      }

      const log = await ctx.prisma.$transaction(async (tx) => {
        const book = await tx.book.upsert({
          where: { openLibraryId: input.openLibraryId },
          create: {
            openLibraryId: input.openLibraryId,
            title: input.title,
            author: input.author,
            coverUrl: input.coverUrl,
          },
          update: {},
        });

        const latestLog = await tx.log.findFirst({
          where: {
            userId: ctx.user.id,
            bookId: book.id,
          },
          orderBy: { readNumber: 'desc' },
          include: { book: true },
        });

        if (
          latestLog &&
          latestLog.status === 'READING' &&
          input.status !== 'READING'
        ) {
          return tx.log.update({
            where: { id: latestLog.id },
            data: {
              status: input.status,
              rating: input.status === 'FINISHED' ? input.rating : null,
              word: input.word ?? null,
              review: input.review ?? null,
              startedAt: input.startedAt ?? latestLog.startedAt,
              finishedAt: input.finishedAt ?? new Date(),
              dnfReason:
                input.status === 'DNF' && 'dnfReason' in input
                  ? (input.dnfReason ?? null)
                  : null,
              dnfProgress:
                input.status === 'DNF' && 'dnfProgress' in input
                  ? (input.dnfProgress ?? null)
                  : null,
            },
            include: { book: true },
          });
        }

        if (
          input.status === 'READING' &&
          latestLog &&
          latestLog.status === 'READING'
        ) {
          return latestLog;
        }

        const createData = {
          userId: ctx.user.id,
          bookId: book.id,
          readNumber: (latestLog?.readNumber ?? 0) + 1,
          status: input.status,
          rating: input.status === 'FINISHED' ? input.rating : null,
          word: input.word ?? null,
          review: input.review ?? null,
          startedAt:
            input.startedAt ?? (input.status === 'READING' ? new Date() : null),
          finishedAt:
            input.finishedAt ??
            (input.status === 'FINISHED' || input.status === 'DNF'
              ? new Date()
              : null),
          dnfReason:
            input.status === 'DNF' && 'dnfReason' in input
              ? (input.dnfReason ?? null)
              : null,
          dnfProgress:
            input.status === 'DNF' && 'dnfProgress' in input
              ? (input.dnfProgress ?? null)
              : null,
        };

        try {
          return await tx.log.create({
            data: createData,
            include: { book: true },
          });
        } catch (error) {
          if (!isReadNumberUniqueConstraintError(error)) {
            throw error;
          }

          const latestAfterConflict = await tx.log.findFirst({
            where: {
              userId: ctx.user.id,
              bookId: book.id,
            },
            orderBy: { readNumber: 'desc' },
          });

          return tx.log.create({
            data: {
              ...createData,
              readNumber: (latestAfterConflict?.readNumber ?? 0) + 1,
            },
            include: { book: true },
          });
        }
      });

      return log;
    }),

  finish: protectedProcedure
    .input(
      z.object({
        logId: z.string().min(1).max(30),
        status: z.enum(['FINISHED', 'DNF']),
        rating: z.number().int().min(1).max(6).nullable(),
        word: wordSchema.nullable(),
        review: z.string().max(5000).nullable(),
        dnfReason: z.string().trim().max(500).nullable().optional(),
        dnfProgress: z.string().trim().max(50).nullable().optional(),
        finishedAt: z.coerce.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.log.findUnique({
        where: { id: input.logId },
      });

      if (!existing) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Log not found' });
      }

      if (existing.userId !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your log' });
      }

      if (existing.status !== 'READING') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only READING logs can be finished',
        });
      }

      if (input.status === 'FINISHED' && !input.rating) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Rating is required when finishing a book',
        });
      }

      if (input.word) {
        const moderation = await moderateText(input.word);
        if (moderation.flagged) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Please choose a different word',
          });
        }
      }

      if (input.review) {
        const moderation = await moderateText(input.review);
        if (moderation.flagged) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Your review contains content that is not allowed. Please revise it.',
          });
        }
      }

      return ctx.prisma.log.update({
        where: { id: input.logId },
        data: {
          status: input.status,
          rating: input.status === 'FINISHED' ? input.rating : null,
          word: input.word ?? null,
          review: input.review ?? null,
          finishedAt: input.finishedAt ?? new Date(),
          dnfReason: input.status === 'DNF' ? (input.dnfReason ?? null) : null,
          dnfProgress:
            input.status === 'DNF' ? (input.dnfProgress ?? null) : null,
        },
        include: { book: true },
      });
    }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    const logs = await ctx.prisma.log.findMany({
      where: { userId: ctx.user.id, isQuickAdd: false },
      select: {
        id: true,
        status: true,
        rating: true,
        word: true,
        createdAt: true,
        startedAt: true,
        book: {
          select: {
            id: true,
            openLibraryId: true,
            title: true,
            author: true,
            coverUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return logs;
  }),

  globalFeed: protectedProcedure.query(async ({ ctx }) => {
    const logs = await ctx.prisma.log.findMany({
      where: {
        isQuickAdd: false,
        userId: { not: ctx.user.id },
      },
      select: {
        id: true,
        status: true,
        rating: true,
        word: true,
        createdAt: true,
        book: {
          select: {
            openLibraryId: true,
            title: true,
            author: true,
            coverUrl: true,
          },
        },
        user: {
          select: {
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return logs;
  }),

  quickAdd: protectedProcedure
    .input(bookDataSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.$transaction(async (tx) => {
        const book = await tx.book.upsert({
          where: { openLibraryId: input.openLibraryId },
          create: {
            openLibraryId: input.openLibraryId,
            title: input.title,
            author: input.author,
            coverUrl: input.coverUrl,
          },
          update: {},
        });

        const existingLog = await tx.log.findFirst({
          where: {
            userId: ctx.user.id,
            bookId: book.id,
          },
        });

        if (!existingLog) {
          await tx.log.create({
            data: {
              userId: ctx.user.id,
              bookId: book.id,
              status: 'FINISHED',
              isQuickAdd: true,
            },
          });
        }

        return book;
      });

      return result;
    }),

  bookStatus: protectedProcedure
    .input(
      z.object({
        openLibraryId: z
          .string()
          .min(1)
          .refine((id) => id.startsWith('/works'), {
            message: 'Must be an OpenLibrary work ID',
          }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const latestLog = await ctx.prisma.log.findFirst({
        where: {
          userId: ctx.user.id,
          book: { openLibraryId: input.openLibraryId },
        },
        select: {
          id: true,
          status: true,
          rating: true,
          word: true,
          createdAt: true,
          startedAt: true,
          book: {
            select: {
              id: true,
              openLibraryId: true,
              title: true,
              author: true,
              coverUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return latestLog;
    }),
});

export type CreateLogInput = z.infer<typeof createLogInputSchema>;
