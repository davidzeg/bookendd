import './instrument';
import { env } from './env';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcService } from './trpc/trpc.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.use(helmet());

  app.enableCors({
    origin: env.CORS_ORIGINS,
    credentials: true,
  });

  const trpcService = app.get(TrpcService);
  app.use('/trpc', trpcService.middleware);

  await app.listen(env.PORT);

  console.log(`API running on http://localhost:${env.PORT}`);
  console.log(`tRPC available at http://localhost:${env.PORT}/trpc`);
}
void bootstrap();
