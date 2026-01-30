import { router } from '../trpc';
import { bookRouter } from './book.router';
import { healthRouter } from './health.router';

export const appRouter = router({
  health: healthRouter,
  book: bookRouter,
});

export type AppRouter = typeof appRouter;
