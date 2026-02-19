import Redis from 'ioredis';
import connectRedis from 'connect-redis';

import session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { parseMaxAge } from './libs/commmon/utils/parse-cookie-maxAge';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
   //password: '1111',
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
  });
 
  const RedisStore = connectRedis(session);
  app.use(cookieParser(configService.getOrThrow('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        prefix:  configService.getOrThrow('SESSION_NAME'), // префикс для ключей в Redis
        ttl: 86400, // время жизни сессии в секундах (24 часа)
      }),
      secret: configService.getOrThrow('SESSION_SECRET'),
      name: configService.getOrThrow('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: configService.getOrThrow('SESSION_DOMAIN'),
        maxAge: parseMaxAge(configService.getOrThrow('SESSION_MAX_AGE')),
        httpOnly: configService.getOrThrow('SESSION_HTTP_ONLY') === 'true',
        secure: configService.getOrThrow('SESSION_SECURE') === 'true',
      },
      /// store:
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
