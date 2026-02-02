import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TrpcModule } from './trpc/trpc.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [PrismaModule, TrpcModule, WebhooksModule],
})
export class AppModule {}
