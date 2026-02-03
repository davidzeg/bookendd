import { z } from 'zod';
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
  const response = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ input: text }),
  });

  if (!response.ok) {
    console.error('Moderation API error:', response.status);
    return { flagged: false, categories: [] };
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
