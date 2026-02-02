import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClerkWebhookController } from './clerk.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ClerkWebhookController],
})
export class WebhooksModule {}
