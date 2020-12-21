import { hash } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@libs/entities';
import { UpdateUserDto } from './dto/update-user.dto';
import { isEmptyOrUndefined } from '../../helpers/is.empty.or.undefined.helpers';
import { ConflictError, UnprocessableEntityError } from '@libs/exceptions';
import { ERRORS, PASSWORD_SALT_ROUNDS } from '@libs/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(newUser: Users): Promise<Users> {
    const emailExists = await this.usersRepository.findOne({
      email: newUser.email,
    });

    if (emailExists) {
      throw new UnprocessableEntityError([
        { field: 'email', message: ERRORS.EMAIL_ALREADY_EXIST },
      ]);
    }

    newUser.password = await hash(newUser.password, PASSWORD_SALT_ROUNDS);

    return this.usersRepository.save(newUser);
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUser: UpdateUserDto): Promise<Users> {
    if (!isEmptyOrUndefined(updateUser)) {
      await this.usersRepository.update({ id }, updateUser);
    }

    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
