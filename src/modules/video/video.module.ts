import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/entities/video.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoRepository } from 'src/repositories/video.repository';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { LikeRepository } from 'src/repositories/like.repository';
import { Like } from 'src/entities/like.entity';
import { Follow } from 'src/entities/follow.entity';
import { FollowRepository } from 'src/repositories/follow.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Like, Follow]), CloudinaryModule],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository, LikeRepository, FollowRepository],
})
export class VideoModule {}
