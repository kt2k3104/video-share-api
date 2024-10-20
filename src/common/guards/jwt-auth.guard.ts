import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user || info) {
      if (info?.message === 'jwt expired') {
        throw new HttpException('Token expired', 419);
      }

      throw err || new UnauthorizedException(info?.message);
    }

    return user;
  }
}
