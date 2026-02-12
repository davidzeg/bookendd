import { moderateText } from './moderation';

jest.mock('../env', () => ({
  env: {
    OPENAI_API_KEY: 'test-key',
  },
}));

describe('moderateText', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns flagged: false for safe content', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            {
              flagged: false,
              categories: { hate: false, sexual: false },
            },
          ],
        }),
    });

    const result = await moderateText('hello world');
    expect(result.flagged).toBe(false);
    expect(result.categories).toEqual([]);
  });

  it('returns flagged: true for blocked category content', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            {
              flagged: true,
              categories: { hate: true, sexual: false },
            },
          ],
        }),
    });

    const result = await moderateText('hateful content');
    expect(result.flagged).toBe(true);
    expect(result.categories).toContain('hate');
  });

  it('throws on API HTTP error (fail-closed)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(moderateText('test')).rejects.toThrow(
      'Content check temporarily unavailable',
    );
  });

  it('throws on network error (fail-closed)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    await expect(moderateText('test')).rejects.toThrow(
      'Content check temporarily unavailable',
    );
  });
});
