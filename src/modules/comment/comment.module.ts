import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from 'src/repositories/comment.repository';
import { LikesCommentRepository } from 'src/repositories/likes-comment.repository';
import { LikesComments } from 'src/entities/likes- comments.entity';
import { Video } from 'src/entities/video.entity';
import { VideoRepository } from 'src/repositories/video.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, LikesComments, Video])],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    LikesCommentRepository,
    VideoRepository,
  ],
})
export class CommentModule {}
