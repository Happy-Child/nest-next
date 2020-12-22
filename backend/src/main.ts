import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

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

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const result = errors.map(
          ({ property: field, constraints: message }: ValidationError) => ({
            field,
            message,
          }),
        );
        return new BadRequestException(result);
      },
    }),
  );

  app.use(cookieParser());

  await app.listen(Number(process.env.SERVICE_API_PORT) || 8001);
}
bootstrap();
