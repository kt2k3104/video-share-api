import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtTokenPayload } from '../types/jwt-token-payload';
import { PassportStrategy } from '@nestjs/passport';
import { UserRepository } from 'src/repositories/user.repositories';
import { UserLoginInformationRepository } from 'src/repositories/user-login-infomation.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userLoginInfoRepository: UserLoginInformationRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.token_jwt_secret_key'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtTokenPayload) {
    if (payload.is_refresh_token || payload.is_admin) {
      throw new UnauthorizedException('Invalid token!');
    }

    // Validate if token is active or not and validate if token belongs to user
    const rawToken = req.headers['authorization'].split(' ')[1];

    const userLoginInfo =
      await this.userLoginInfoRepository.findOneByAccessToken(rawToken);

    if (!userLoginInfo || userLoginInfo.user_id != payload.sub) {
      throw new UnauthorizedException('Invalid token!');
    }

    return this.userRepository.findById(payload.sub);
  }
}
