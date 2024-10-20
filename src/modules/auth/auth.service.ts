import { UserLoginInformationRepository } from 'src/repositories/user-login-infomation.repository';
import { UserRepository } from './../../repositories/user.repositories';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { MailerService } from '@nest-modules/mailer';
import { RegisterReq } from './dto/register.req';
import { compare, hashPassword } from 'src/utils/bcrypt';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';
import { SuccessRes } from 'src/common/types/response';
import { ResetPasswordReq } from './dto/reset-password.req';
import { LoginReq } from './dto/login.req';
import {
  AccountPayload,
  JwtTokenPayload,
} from 'src/common/types/jwt-token-payload';
import { TokenInfoRes } from './dto/token-info.req';
import { LoginRes } from './dto/login.res';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userLoginInfoRepository: UserLoginInformationRepository,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerReq: RegisterReq) {
    const user = await this.userRepository.findOne({
      where: [
        { email: registerReq.email, phone_number: registerReq.phone_number },
      ],
    });

    if (user) {
      const errMessage =
        user.email === registerReq.email
          ? 'Email already exists'
          : 'Phone number already exists';
      throw new BadRequestException(errMessage);
    }

    const hashPass = hashPassword(registerReq.password);

    delete registerReq.password;

    const newUser = await this.userRepository.save({
      ...registerReq,
      hash_password: hashPass,
      role:
        registerReq.role === UserRole.SELLER ? UserRole.SELLER : UserRole.BUYER,
      status: UserStatus.INACTIVE,
    });

    await this.userLoginInfoRepository.save({
      user: newUser,
    });

    if (newUser) {
      const hashed = hashPassword(registerReq.email);
      const appDomain = this.configService.get('app.domain');
      const appPort = this.configService.get('app.port');
      const appPrefix = this.configService.get('app.prefix');
      const appVersion = this.configService.get('app.version');
      const verifyUrl = `http://${appDomain}:${appPort}/${appPrefix}/${appVersion}/auth/verify?user_id=${newUser.id.toString()}&token=${hashed}`;

      this.mailerService.sendMail({
        to: newUser.email,
        subject: 'Welcome to E-commerce App',
        template: './verify',
        context: {
          name: newUser.full_name,
          verifyUrl,
        },
      });
    }
    return new SuccessRes(
      'Register successfully! Please check your email to verify account',
    );
  }

  async verifyAccount(user_id: number, token: string) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const checked = compare(user.email, token);

    if (!checked) {
      throw new BadRequestException('Verify account failed');
    }

    await this.userRepository.update(
      { id: user_id },
      { status: UserStatus.ACTIVE },
    );

    return new SuccessRes('Verify account successfully');
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email not registered');
    }

    //generate password reset token
    const token = this.jwtService.sign(
      { email, user_id: user.id },
      {
        secret: this.configService.get('app.token_jwt_secret_key'),
        expiresIn: this.configService.get(
          'app.token_password_reset_expire_time',
        ),
      },
    );

    await this.userLoginInfoRepository.update(
      { user_id: user.id },
      { reset_password_token: token },
    );

    // Send the password reset email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset password',
      template: './reset-password',
      context: {
        name: user.full_name,
        resetPassUrl: 'http://localhost:9000/reset-password?token=' + token, // change to your frontend url
      },
    });

    return new SuccessRes('Please check your email to reset password');
  }

  async resetPassword({ email, token, password }: ResetPasswordReq) {
    const { email: emailToken, user_id } = await this.jwtService.verify(token, {
      secret: this.configService.get('app.token_jwt_secret_key'),
    });

    if (email !== emailToken) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const userLoginInfo = await this.userLoginInfoRepository.findOne({
      where: { user_id },
    });

    if (userLoginInfo.reset_password_token !== token) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const hashedPassword = hashPassword(password);

    await this.userRepository.update(
      { email },
      { hash_password: hashedPassword },
    );

    await this.userLoginInfoRepository.update(
      { user_id },
      { reset_password_token: null },
    );

    return new SuccessRes('Reset password successfully');
  }

  async login({ email, password }: LoginReq): Promise<any> {
    // check email
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .addSelect('u.hash_password')
      .getOne();

    if (!user) {
      throw new BadRequestException('Email is not registred.');
    }

    // match password
    const checkPass = compare(password, user.hash_password);
    if (!checkPass) {
      throw new BadRequestException('Password is not correct');
    }

    const tokens = await this.issueToken({
      sub: user.id,
      is_admin: user.role === UserRole.ADMIN,
    });

    await this.userLoginInfoRepository.update(
      { user_id: user.id },
      {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    );

    delete user.hash_password;
    return {
      ...new SuccessRes('Login successfully'),
      data: { ...tokens },
    };
  }

  async logout(user_id: string) {
    await this.userLoginInfoRepository.update(
      { user_id: parseInt(user_id) },
      { access_token: null, refresh_token: null },
    );
    return new SuccessRes('Logout successfully');
  }

  async changePassword(
    user_id: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const checkPass = compare(oldPassword, user.hash_password);

    if (!checkPass) {
      throw new BadRequestException('Old password is not correct');
    }

    const hashedPassword = hashPassword(newPassword);

    await this.userRepository.update(
      { id: user_id },
      { hash_password: hashedPassword },
    );

    return new SuccessRes('Change password successfully');
  }

  private async decodeRefreshToken(
    refreshToken: string,
  ): Promise<JwtTokenPayload> {
    try {
      const tokenSecret = this.configService.get('app.token_jwt_secret_key');
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: tokenSecret,
      });
    } catch (e) {
      throw new BadRequestException('Invalid refresh_token!');
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginRes> {
    const userLoginInfo =
      await this.userLoginInfoRepository.findOneByRefreshToken(refreshToken);

    if (!userLoginInfo) {
      throw new BadRequestException('Invalid refresh_token');
    }
    const data = await this.decodeRefreshToken(refreshToken);

    // Validate if this token is for user and if this token belongs to user
    if (data.is_admin || data.sub !== userLoginInfo.user_id) {
      throw new BadRequestException('Invalid refresh_token!');
    }

    const user = await this.userRepository.findById(data.sub);

    if (!user) {
      throw new NotFoundException('Invalid refresh_token!');
    }

    const tokens = await this.issueToken({
      sub: user.id,
      is_admin: user.role === UserRole.ADMIN,
    });

    await this.userLoginInfoRepository.update(
      { user_id: user.id },
      {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    );

    return {
      ...new SuccessRes('Refresh token successfully!'),
      data: { ...tokens, user: user },
    };
  }

  async issueToken(payload: AccountPayload): Promise<TokenInfoRes> {
    const tokenExpireTime = this.configService.get('app.token_expire_time');
    const refreshTokenExpireTime = this.configService.get(
      'app.token_refresh_expire_time',
    );
    const tokenSecret = this.configService.get('app.token_jwt_secret_key');

    const accessTokenPayload: JwtTokenPayload = {
      ...payload,
      is_refresh_token: false,
    };
    const refreshTokenPayload: JwtTokenPayload = {
      ...payload,
      is_refresh_token: true,
    };

    return {
      access_token: await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: `${tokenExpireTime}`,
        secret: tokenSecret,
      }),
      refresh_token: await this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: `${refreshTokenExpireTime}`,
        secret: tokenSecret,
      }),
    };
  }
}
