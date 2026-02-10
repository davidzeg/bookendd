import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClerkWebhookController } from './clerk.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ClerkWebhookController],
})
export class WebhooksModule {}
