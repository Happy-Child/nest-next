import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { COOKIE } from '@libs/constants';
import { RequestUser } from '../dtos/request-user.dto';
import { UsersRepository } from '../repositories/user.repository';

const JWT_SECRET = 'test';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req) {
            if (req.cookies && req.cookies[COOKIE.ACCESS_TOKEN]) {
              return req.cookies[COOKIE.ACCESS_TOKEN];
            }

            const tokenHeader = req.header(COOKIE.ACCESS_TOKEN);
            if (tokenHeader) {
              return tokenHeader;
            }
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  public async validate(payload: any): Promise<RequestUser> {
    if (payload.role) {
      const user = await this.usersRepository.findOne({
        where: {
          email: payload?.email,
        },
      });

      if (user && !user.verified) {
        throw new UnauthorizedException();
      }
    }

    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
