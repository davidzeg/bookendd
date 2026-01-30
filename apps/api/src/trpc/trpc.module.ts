import { Injectable, Module } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { PrismaService } from '../prisma/prisma.service';
import { appRouter } from './routers';
import { createContextFactory } from './context';

@Injectable()
export class TrpcService {
  public readonly middleware: ReturnType<
    typeof trpcExpress.createExpressMiddleware
  >;

  constructor(private readonly prisma: PrismaService) {
    this.middleware = trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: createContextFactory(prisma),
    });
  }
}

@Module({
  providers: [TrpcService],
  exports: [TrpcService],
})
export class TrpcModule {}
