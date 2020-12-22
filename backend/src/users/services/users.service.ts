import { hash } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Users } from '@libs/entities';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { isEmptyOrUndefined } from '../../../helpers/is.empty.or.undefined.helpers';
import { ConflictError } from '@libs/exceptions';
import { ERRORS, PASSWORD_SALT_ROUNDS } from '@libs/constants';
import { LoginUserDto } from '../dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async login(data: LoginUserDto): Promise<{ user: Users; token: string }> {
    const user = await this.usersRepository.findOne({
      email: data.email,
    });

    if (!user) {
      throw new ConflictError([
        { field: null, message: ERRORS.USER_NOT_FOUND },
      ]);
    }

    if (!user.verified) {
      throw new ConflictError([
        { field: null, message: ERRORS.USER_NOT_VERIFIED },
      ]);
    }

    const payload = { email: user.email };

    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async me(email): Promise<Users> {
    const user = await this.usersRepository.findOne({
      email,
    });

    if (!user) {
      throw new ConflictError([
        { field: null, message: ERRORS.USER_NOT_FOUND },
      ]);
    }

    return user;
  }

  async create(newUser: Users): Promise<boolean> {
    const emailExists = await this.usersRepository.findOne({
      email: newUser.email,
    });

    if (emailExists) {
      throw new ConflictError([
        { field: 'email', message: ERRORS.EMAIL_ALREADY_EXIST },
      ]);
    }

    newUser.password = await hash(newUser.password, PASSWORD_SALT_ROUNDS);

    const user = await this.usersRepository.save(newUser);

    await this._sendConfirmEmail(user.email);

    return true;
  }

  async confirmEmail(email): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      email,
    });

    if (!user) {
      throw new ConflictError([
        { field: null, message: ERRORS.USER_NOT_FOUND },
      ]);
    }

    const verified = user.verified;

    if (verified) {
      throw new ConflictError([
        { field: null, message: ERRORS.USER_NOT_FOUND },
      ]);
    }

    return await this._sendConfirmEmail(user.email);
  }

  async confirmedEmail(token): Promise<boolean> {
    const { email } = this.jwtService.verify(token);

    if (!email) {
      return false;
    }

    const user = await this.usersRepository.findOne({
      email,
    });

    if (!user) {
      throw new ConflictError([
        { field: null, message: ERRORS.USER_NOT_FOUND },
      ]);
    }

    user.verified = true;

    await this.usersRepository.save(user);

    return true;
  }

  list() {
    return [];
  }

  show(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(email, updateUser: UpdateUserDto): Promise<Users> {
    let user: Users = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new ConflictError([
        { field: null, message: ERRORS.USER_NOT_FOUND },
      ]);
    }

    let verified = user.verified;
    const newEmail = updateUser.email !== user.email;

    if (updateUser.email && newEmail) {
      const emailExists = await this.usersRepository.findOne({
        email: updateUser.email,
      });

      if (emailExists) {
        throw new ConflictError([
          { field: 'email', message: ERRORS.EMAIL_ALREADY_EXIST },
        ]);
      }

      verified = false;
    }

    if (!isEmptyOrUndefined(updateUser)) {
      user = await this.usersRepository.save({
        ...user,
        ...updateUser,
        verified,
      });
    }

    if (!verified) {
      await this._sendConfirmEmail(user.email);
    }

    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async _sendConfirmEmail(email): Promise<boolean> {
    const token = this.jwtService.sign({
      email,
    });

    await this.mailerService.sendMail({
      to: email,
      from: 'nest_next@test.io',
      subject: 'Confirm registration',
      text: 'Confirm registration',
      html: `<b>Confirm registration<br><a href="http://localhost:3000?token=${token}">Confirm</a></b>`,
    });

    return true;
  }
}
