import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose, Exclude, Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
  Length,
} from 'class-validator';
import {
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  ERRORS,
  USERS_SEXES,
} from '@libs/constants';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const transformPhoneNumber = (value) =>
  value && typeof value === 'string' && parsePhoneNumberFromString(value)
    ? parsePhoneNumberFromString(value).format('E.164')
    : value;

const phoneErrorMessage = { message: ERRORS.INVALID_PHONE_NUMBER };
const commonErrorMessage = { field: null, message: ERRORS.INVALID_VALUE };

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString(commonErrorMessage)
  @Length(2, MAX_NAME_LENGTH, commonErrorMessage)
  @Transform((value) => value.trim())
  @Column()
  firstName: string;

  @IsString(commonErrorMessage)
  @Length(2, MAX_NAME_LENGTH, commonErrorMessage)
  @Transform((value) => value.trim())
  @Column()
  lastName: string;

  @IsEmail({}, commonErrorMessage)
  @Column()
  email: string;

  @IsOptional()
  @IsString(phoneErrorMessage)
  @IsMobilePhone('be-BY', {}, commonErrorMessage)
  @Transform(transformPhoneNumber)
  @Column({ nullable: true })
  phone: string;

  @IsOptional()
  @IsString(commonErrorMessage)
  @IsEnum(USERS_SEXES, commonErrorMessage)
  @Column({ type: 'enum', enum: USERS_SEXES, nullable: true })
  sex: USERS_SEXES;

  @IsString(commonErrorMessage)
  @MinLength(MIN_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_SHORT })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: ERRORS.PASSWORD_TOO_LONG })
  @Expose()
  @Column()
  password: string;

  @IsOptional()
  @IsBoolean(commonErrorMessage)
  @Exclude()
  @Column({ nullable: true })
  verified: boolean;

  @IsOptional()
  @Exclude()
  @Column({ type: 'integer', nullable: true })
  previewAvatarId: number;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;

  constructor(object: Partial<Users>) {
    Object.assign(this, object);
  }
}
