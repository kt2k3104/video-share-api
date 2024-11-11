import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VideoService } from './video.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  filterVideoConfig,
  storageConfig,
} from 'src/common/config/upload-files-config';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';

@ApiTags('Video')
@Controller('videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private cloudinaryService: CloudinaryService,
  ) {}
  // Get paginated videos
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-paginated-videos',
    summary: 'Get paginated videos',
    description: 'Retrieve videos with pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPaginatedVideos(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.videoService.getPaginatedVideos(page, limit);
  }

  // get video by id
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-video-by-id',
    summary: 'Get video by id',
    description: 'Retrieve video by id',
  })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getVideoById(@Param('id', ParseIntPipe) id: number) {
    return await this.videoService.getVideoById(id);
  }

  // Upload Video
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'upload-video',
    summary: 'Upload video',
    description: 'Upload video to cloudinary',
  })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('video', {
      storage: storageConfig('videos'),
      fileFilter: filterVideoConfig(),
    }),
  )
  async uploadVideo(
    @Req() req: any,
    @CurrentUser() { full_name, avatar_url }: User,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('start_time_to_set_thumb') startTime: string,
  ): Promise<any> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const cloudFile = await this.cloudinaryService.uploadVideo(
        file,
        startTime ? parseInt(startTime) : 0,
      );
      return await this.videoService.createVideo(
        {
          user_id: req.user.id,
          title,
          description,
          url: cloudFile.secure_url,
          thumbnail_url: cloudFile.eager[0].secure_url,
          public_id: cloudFile.public_id,
        },
        full_name,
        avatar_url,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error when upload file');
    }
  }

  // update thumbnail video
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'update-thumbnail-video',
    summary: 'Update thumbnail video',
    description: 'Update thumbnail video to cloudinary',
  })
  @Patch(':video_id/thumbnail')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateThumbnailVideo(
    @Param('video_id') videoId: string,
    @Body('start_offset', ParseIntPipe) startOffset: number,
  ) {
    // Lấy thông tin video từ cơ sở dữ liệu để tìm `publicId`
    const video = (await this.videoService.getVideoById(+videoId)).data;
    if (!video) {
      throw new BadRequestException('Video not found');
    }
    // Gọi Cloudinary để cập nhật thumbnail với start_offset mới
    const updatedFile = await this.cloudinaryService.updateThumbnailStartOffset(
      video.public_id,
      startOffset,
    );
    return await this.videoService.updateVideoData(+videoId, {
      thumbnail_url: updatedFile.eager[0].secure_url,
    });
  }

  // update video data
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'update-video-data',
    summary: 'Update video data',
    description: 'Update video data',
  })
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateVideoData(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return await this.videoService.updateVideoData(id, data);
  }

  // delete video
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'delete-video',
    summary: 'Delete video',
    description: 'Delete video',
  })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteVideo(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    await this.cloudinaryService.destroyFileVideo(data.url);
    return await this.videoService.deleteVideo(id);
  }

  // get video by user id
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-video-by-user-id',
    summary: 'Get video by user id',
    description: 'Retrieve video by user id',
  })
  @Get('user/:user_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getVideoByUserId(@Param('user_id', ParseIntPipe) userId: number) {
    return await this.videoService.getVideoByUserId(userId);
  }

  // toggle like video
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'toggle-like-video',
    summary: 'Toggle like video',
    description: 'Toggle like video',
  })
  @Get(':video_id/like-toggle')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async toggleLikeVideo(
    @Param('video_id', ParseIntPipe) videoId: number,
    @Req() req: any,
    @CurrentUser() { full_name, avatar_url }: User,
  ) {
    return await this.videoService.toggleLikeVideo(
      videoId,
      req.user.id,
      full_name,
      avatar_url,
    );
  }

  // search video
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'search-video',
    summary: 'Search video',
    description: 'Search video',
  })
  @Get('search')
  async searchVideo(@Query('keyword') keyword: string) {
    return await this.videoService.searchVideo(keyword);
  }
}
