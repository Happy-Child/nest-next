import { NotAcceptableException } from '@nestjs/common';
import { IAbstractError, ErrorDetail } from './abstract.error';

const defaultError = [
  {
    field: '',
    message: 'Not Acceptable',
  },
];

export class NotAcceptableError
  extends NotAcceptableException
  implements IAbstractError {
  constructor(public readonly details: ErrorDetail[] = defaultError) {
    super();
  }
}
