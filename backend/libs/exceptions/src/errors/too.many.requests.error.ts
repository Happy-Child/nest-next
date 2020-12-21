import { HttpException } from '@nestjs/common';
import { IAbstractError, ErrorDetail } from './abstract.error';

const defaultError = [
  {
    field: '',
    message: 'Too Many Requests',
  },
];

export class TooManyRequestsError
  extends HttpException
  implements IAbstractError {
  constructor(public readonly details: ErrorDetail[] = defaultError) {
    super('Too Many Requests', 429);
  }
}
