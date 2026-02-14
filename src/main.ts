import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser(configService.getOrThrow('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin: configService.getOrThrow('ALLOWED_ORIGIN'),
    credentials: true,
    exposeHeaders: ['set-cookie'],
  });
  await app.listen(configService.getOrThrow('APPLICATION_PORT') ?? 3000);
}
bootstrap();
