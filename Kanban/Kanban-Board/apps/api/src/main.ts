import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ZodValidationPipe());

  app.enableCors({
    origin: configService.get<string>('CLIENT_URL', 'http://localhost:5173'),
    credentials: false,
  });

  app.setGlobalPrefix('api');

  const port = configService.get<number>('API_PORT', 3000);

  await app.listen(port);
}

bootstrap().catch((error: unknown) => {
  Logger.error(
    'Application bootstrap failed',
    error instanceof Error ? error.stack : undefined,
  );

  process.exit(1);
});
