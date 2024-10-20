import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokenPayload } from '../types/jwt-token-payload';
import { UserRepository } from 'src/repositories/user.repositories';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.token_jwt_secret_key'),
    });
  }

  async validate(payload: JwtTokenPayload) {
    if (payload.is_refresh_token || !payload.is_admin) {
      throw new UnauthorizedException('Invalid token!');
    }

    return this.userRepository.findById(payload.sub);
  }
}
