import { router } from '../trpc';
import { bookRouter } from './book.router';
import { healthRouter } from './health.router';
import { logRouter } from './log.router';

export const appRouter = router({
  health: healthRouter,
  book: bookRouter,
  log: logRouter,
});

export type AppRouter = typeof appRouter;
