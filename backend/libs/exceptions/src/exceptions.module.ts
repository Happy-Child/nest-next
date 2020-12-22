import { Module } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/exception.filter';
import { APP_FILTER, APP_PIPE } from '@nestjs/core/constants';
import { ExceptionPipe } from './middlewares/validation.pipe';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ExceptionPipe,
    },
  ],
})
export class ExceptionsModule {}
