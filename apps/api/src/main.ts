import './instrument';
import { env } from './env';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcService } from './trpc/trpc.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.use(helmet());

  app.enableCors({
    origin: env.CORS_ORIGINS,
    credentials: true,
  });

  // Rate limit tRPC endpoints — NestJS ThrottlerGuard does not cover raw Express middleware
  const trpcLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      error: { message: 'Too many requests, please try again later.' },
    },
  });

  const trpcService = app.get(TrpcService);
  app.use('/trpc', trpcLimiter, trpcService.middleware);

  await app.listen(env.PORT);

  console.log(`API running on http://localhost:${env.PORT}`);
  console.log(`tRPC available at http://localhost:${env.PORT}/trpc`);
}
void bootstrap();
