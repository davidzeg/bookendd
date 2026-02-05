import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

const openLibraryDocSchema = z.object({
  key: z.string(),
  title: z.string(),
  author_name: z.array(z.string()).optional(),
  cover_i: z.number().optional(),
  first_publish_year: z.number().optional(),
});

const openLibrarySearchResponseSchema = z.object({
  numFound: z.number(),
  docs: z.array(openLibraryDocSchema),
});

type OpenLibraryDoc = z.infer<typeof openLibraryDocSchema>;

export interface BookSearchResult {
  openLibraryId: string;
  title: string;
  author: string | null;
  coverUrl: string | null;
  firstPublishYear: number | null;
}

const OPEN_LIBRARY_BASE = 'https://openlibrary.org';
const COVERS_BASE = 'https://covers.openlibrary.org/b/id';
const SEARCH_TIMEOUT_MS = 5000;

function getCoverUrl(
  coverId: number | undefined,
  size: 'S' | 'M' | 'L' = 'M',
): string | null {
  if (!coverId) return null;
  return `${COVERS_BASE}/${coverId}-${size}.jpg`;
}

function transformDoc(doc: OpenLibraryDoc): BookSearchResult {
  return {
    openLibraryId: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] ?? null,
    coverUrl: getCoverUrl(doc.cover_i),
    firstPublishYear: doc.first_publish_year ?? null,
  };
}

export const bookRouter = router({
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        limit: z.number().min(1).max(20).default(10),
      }),
    )
    .query(async ({ input }): Promise<BookSearchResult[]> => {
      const { query, limit } = input;

      const params = new URLSearchParams({
        q: query,
        fields: 'key,title,author_name,cover_i,first_publish_year',
        limit: limit.toString(),
      });

      const url = `${OPEN_LIBRARY_BASE}/search.json?${params}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent':
              'Antilogos/1.0 (https://antilogos.com; contact@bookendd.com)',
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `OpenLibrary API returned ${response.status}`,
          });
        }

        const json: unknown = await response.json();
        const data = openLibrarySearchResponseSchema.parse(json);

        return data.docs.map(transformDoc);
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        if (error instanceof z.ZodError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Invalid response from OpenLibrary API',
            cause: error,
          });
        }

        if (error instanceof Error && error.name === 'AbortError') {
          throw new TRPCError({
            code: 'TIMEOUT',
            message: 'Book search timed out - please try again',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search books',
          cause: error,
        });
      } finally {
        clearTimeout(timeoutId);
      }
    }),
});
