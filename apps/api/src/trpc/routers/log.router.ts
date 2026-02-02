import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

const bookDataSchema = z.object({
  openLibraryId: z
    .string()
    .min(1)
    .refine((id) => id.startsWith('/works/'), {
      message: 'Must be an OpenLibrary work ID (e.g., /works/OL123W)',
    }),
  title: z.string().min(1),
  author: z.string().nullable(),
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
});

const dnfLogSchema = z.object({
  status: z.literal('DNF'),
  rating: z.null().optional(), // Explicitly forbidden
  word: wordSchema.nullable(),
});

const logDataSchema = z.discriminatedUnion('status', [
  finishedLogSchema,
  dnfLogSchema,
]);

const createLogInputSchema = z.intersection(bookDataSchema, logDataSchema);

export const logRouter = router({
  create: protectedProcedure
    .input(createLogInputSchema)
    .mutation(async ({ ctx, input }) => {
      const clerkId = ctx.user.clerkId;

      const log = await ctx.prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
          where: { clerkId },
          select: { id: true },
        });

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

        return tx.log.create({
          data: {
            userId: user.id,
            bookId: book.id,
            status: input.status,
            rating: input.status === 'FINISHED' ? input.rating : null,
            word: input.word,
            finishedAt: input.status === 'FINISHED' ? new Date() : null,
          },
          include: {
            book: true,
          },
        });
      });

      return log;
    }),
});

export type CreateLogInput = z.infer<typeof createLogInputSchema>;
