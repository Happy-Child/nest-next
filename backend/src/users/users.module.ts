import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ExceptionsModule } from '@libs/exceptions';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRES_SECS } from '@libs/constants';
import { JwtStrategyService } from './services/jwt.strategy.service';
import { PassportModule } from '@nestjs/passport';
import { UsersRepository } from './repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    ExceptionsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'test',
      signOptions: {
        expiresIn: ACCESS_TOKEN_EXPIRES_SECS,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'egor.lazuka@gmail.com',
          pass: 'EMassa99211268',
        },
      },
      preview: true,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategyService],
})
export class UsersModule {}
