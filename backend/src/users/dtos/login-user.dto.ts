import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';
import { Expose } from 'class-transformer';
import {
  ERRORS,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@libs/constants';

const commonErrorMessage = { field: null, message: ERRORS.INVALID_VALUE };

export class LoginUserDto {
  @IsEmail({}, commonErrorMessage)
  @Column()
  email: string;

  @IsString(commonErrorMessage)
  @MinLength(MIN_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_SHORT })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_LONG })
  @Expose()
  @Column()
  password: string;
}
