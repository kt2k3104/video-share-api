import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SuccessRes } from 'src/common/types/response';
import { RegisterReq } from './dto/register.req';
import { VerifyQuery } from './dto/verify.query';
import { ForgotPasswordReq } from './dto/forgot-password.req';
import { ResetPasswordReq } from './dto/reset-password.req';
import { LoginRes } from './dto/login.res';
import { LoginReq } from './dto/login.req';
import { RefreshTokenReq } from './dto/refresh-token.req';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'register',
    summary: 'Register',
    description: 'Register',
  })
  @Post('register')
  async register(@Body() registerReq: RegisterReq) {
    return await this.authService.register(registerReq);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'verify-account',
    summary: 'Verify account',
    description: 'Verify account',
  })
  @Get('verify')
  @UsePipes(ValidationPipe)
  async verify(@Query() { user_id, token }: VerifyQuery) {
    return await this.authService.verifyAccount(user_id, token);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'forgot-password',
    summary: 'Forgot password',
    description: 'Forgot password',
  })
  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() { email }: ForgotPasswordReq) {
    return await this.authService.forgotPassword(email);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'reset-password',
    summary: 'Reset password',
    description: 'Reset password',
  })
  @Post('reset-password')
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() request: ResetPasswordReq) {
    return await this.authService.resetPassword(request);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginRes,
  })
  @ApiOperation({
    operationId: 'login',
    summary: 'Login',
    description: 'Login',
  })
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() request: LoginReq) {
    return await this.authService.login(request);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'logout',
    summary: 'Logout',
    description: 'Logout',
  })
  @Post('logout')
  @UsePipes(ValidationPipe)
  async logout(@Body() { user_id }: { user_id: string }) {
    return await this.authService.logout(user_id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'change-password',
    summary: 'Change password',
    description: 'Change password',
  })
  @Post('change-password')
  @UsePipes(ValidationPipe)
  async changePassword(@Body() { user_id, old_password, new_password }) {
    return await this.authService.changePassword(
      user_id,
      old_password,
      new_password,
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginRes,
  })
  @ApiOperation({
    operationId: 'refresh-token',
    summary: 'Refresh token',
    description: 'Refresh token',
  })
  @Post('refresh-token')
  @UsePipes(ValidationPipe)
  async refreshToken(@Body() { refresh_token }: RefreshTokenReq) {
    return await this.authService.refreshToken(refresh_token);
  }
}
