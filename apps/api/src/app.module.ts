import { Module } from '@nestjs/common';
import { SentryModule } from '@sentry/nestjs/setup';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TrpcModule } from './trpc/trpc.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    SentryModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    TrpcModule,
    WebhooksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
