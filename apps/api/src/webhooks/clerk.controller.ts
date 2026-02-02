import { Controller, Post, Req, Res } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Webhook } from 'svix';
import { env } from '../env';
import { PrismaService } from '../prisma/prisma.service';

interface ClerkUserEvent {
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
    }>;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
  type: string;
}

@Controller('webhooks/clerk')
export class ClerkWebhookController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const svixId = req.headers['svix-id'] as string;
    const svixTimestamp = req.headers['svix-timestamp'] as string;
    const svixSignature = req.headers['svix-signature'] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({ error: 'Missing svix headers' });
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      return res.status(400).json({ error: 'Missing raw body' });
    }

    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
    let event: ClerkUserEvent;

    try {
      event = wh.verify(rawBody.toString(), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkUserEvent;
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    if (event.type === 'user.created') {
      await this.handleUserCreated(event.data);
    }

    return res.status(200).json({ received: true });
  }

  private async handleUserCreated(data: ClerkUserEvent['data']) {
    const { id: clerkId, username, email_addresses } = data;

    const generatedUsername =
      username ??
      email_addresses[0]?.email_address.split('@')[0] ??
      `user_${clerkId.slice(-8)}`;

    await this.prisma.user.upsert({
      where: { clerkId },
      create: {
        clerkId,
        username: generatedUsername,
      },
      update: {},
    });

    console.log(`Upserted user: ${generatedUsername} (${clerkId})`);
  }
}
