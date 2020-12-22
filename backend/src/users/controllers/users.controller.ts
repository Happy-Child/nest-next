import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { LoginUserDto } from '../dtos/login-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Users } from '@libs/entities';
import { COOKIE } from '@libs/constants';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() data: LoginUserDto) {
    return this.usersService.login(data);
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async signOut(@Res() res) {
    res.clearCookie(COOKIE.ACCESS_TOKEN);
    res.send(true);
  }

  @Post('/me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  me(@Req() { user }) {
    return this.usersService.me(user.email);
  }

  @Get('/confirm-email')
  @HttpCode(200)
  confirmEmail(@Query() { email }) {
    return this.usersService.confirmEmail(email);
  }

  @Post('/confirmed-email')
  @HttpCode(200)
  confirmedEmail(@Body() { token }) {
    return this.usersService.confirmedEmail(token);
  }

  @Post('')
  @HttpCode(200)
  create(@Body() newUser: Users) {
    return this.usersService.create(newUser);
  }

  @Get('')
  list() {
    return this.usersService.list();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.show(+id);
  }

  @Put('')
  @UseGuards(AuthGuard('jwt'))
  update(@Req() { user }, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.email, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.remove(Number(id));
  }
}
