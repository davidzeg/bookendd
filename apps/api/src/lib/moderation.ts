import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { env } from '../env';

const moderationResponseSchema = z.object({
  results: z.array(
    z.object({
      flagged: z.boolean(),
      categories: z.record(z.string(), z.boolean()),
    }),
  ),
});

interface ModerationResult {
  flagged: boolean;
  categories: string[];
}

const BLOCKED_CATEGORIES = [
  'hate',
  'hate/threatening',
  'harassment/threatening',
  'sexual/minors',
];

export async function moderateText(text: string): Promise<ModerationResult> {
  let response: Response;

  try {
    response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ input: text }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.error('Moderation API network error:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Content check temporarily unavailable. Please try again.',
      cause: error,
    });
  }

  if (!response.ok) {
    console.error('Moderation API error:', response.status);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Content check temporarily unavailable. Please try again.',
      cause: new Error(`Moderation API returned ${response.status}`),
    });
  }

  const json: unknown = await response.json();
  const data = moderationResponseSchema.parse(json);
  const result = data.results[0];

  const flaggedCategories = Object.entries(result.categories)
    .filter(([, flagged]) => flagged)
    .map(([category]) => category);

  const hasBlockedCategory = flaggedCategories.some((cat) =>
    BLOCKED_CATEGORIES.includes(cat),
  );

  return {
    flagged: hasBlockedCategory,
    categories: flaggedCategories,
  };
}
