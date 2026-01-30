import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { trpcMiddleware } from './trpc/trpc.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/trpc', trpcMiddleware);

  await app.listen(process.env.PORT ?? 3001);

  console.log('API running on http://localhost:3001');
  console.log('tRPC available at http://localhost:3001/trpc');
}
bootstrap();
