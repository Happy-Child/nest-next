import { PartialType } from '@nestjs/mapped-types';
import { Users } from '@libs/entities';

export class UpdateUserDto extends PartialType(Users) {}
