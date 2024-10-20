import { CloudinaryService } from './../cloudinary/cloudinary.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  filterImageConfig,
  storageConfig,
} from 'src/common/config/upload-files-config';
import { SuccessRes } from 'src/common/types/response';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-all-users',
    summary: 'Get all users',
    description: 'Get all users',
  })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-my-profile',
    summary: 'Get my profile',
    description: 'Get my profile',
  })
  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'update-my-profile',
    summary: 'Update my profile',
    description: 'Update my profile',
  })
  @Put('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: User, @Body() data: any) {
    return await this.userService.updateProfile(user.id, data);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'upload-avatar',
    summary: 'Upload avatar',
    description: 'Upload avatar',
  })
  @Post('me/avatar')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('avatars'),
      fileFilter: filterImageConfig(),
    }),
  )
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const cloudFile = await this.cloudinaryService.uploadFile(file);

      if (req.user.avatar) {
        await this.cloudinaryService.destroyFile(req.user.avatar);
      }
      await this.userService.updateProfile(req.user.id, {
        avatar: cloudFile.secure_url,
      });
      return new SuccessRes('Upload avatar successfully');
    } catch (error) {
      throw new InternalServerErrorException('Error when upload file');
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-other-profile',
    summary: 'Get other profile',
    description: 'Get other profile',
  })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getOtherProfile(@Param('id') id: number) {
    return await this.userService.getOtherProfile(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-notification',
    summary: 'Get notification',
    description: 'Get notification',
  })
  @Get('notifications')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getNotification(@CurrentUser() user: User) {
    return await this.userService.getNotification(user.id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'set-is-read-notifications',
    summary: 'Set is read notifications',
    description: 'Set is read notifications',
  })
  @Post('notifications/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setIsReadNotifications(@CurrentUser() user: User) {
    return await this.userService.setIsReadNotification(user.id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'set-is-read-notifications-with-id',
    summary: 'Set is read notification with id',
    description: 'Set is read notification with id',
  })
  @Post('notifications/:id/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setIsReadNotificationWithId(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ) {
    return await this.userService.setIsReadNotificationWithId(user.id, id);
  }
}
