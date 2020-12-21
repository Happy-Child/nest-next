import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  if (true) {
    const corsOptions = {
      origin: (origin, callback) => {
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
      headers: [
        'x-user',
        'X-Signature',
        'accept',
        'content-type',
        'authorization',
      ],
    };

    app.use(cors(corsOptions));
  }

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(cookieParser());

  await app.listen(Number(process.env.SERVICE_API_PORT) || 8001);
}
bootstrap();
