import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './routers';

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
});
