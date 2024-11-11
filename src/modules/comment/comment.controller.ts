import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateCommentReq } from './dto/create-comment.req';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { use } from 'passport';
import { User } from 'src/entities/user.entity';

@ApiTags('Comment')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // get paginated comments by video id
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-comments',
    summary: 'Get comments',
    description: 'Get comments',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get(':videoId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getComments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Param('videoId') videoId: string,
  ) {
    return await this.commentService.getComments(+videoId, page, limit);
  }

  // Create comment
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'create-comment',
    summary: 'Create comment',
    description: 'Create comment',
  })
  @Post(':videoId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('videoId') videoId: string,
    @Body() createCommentReq: CreateCommentReq,
    @Req() req: any,
  ) {
    return await this.commentService.createComment(
      +videoId,
      req.user.id,
      createCommentReq,
    );
  }

  // delete comment
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'delete-comment',
    summary: 'Delete comment',
    description: 'Delete comment',
  })
  @Delete(':commentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('commentId') commentId: string, @Req() req: any) {
    return await this.commentService.deleteComment(+commentId, req.user.id);
  }

  // toggle like comment
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'toggle-like-comment',
    summary: 'Toggle like comment',
    description: 'Toggle like comment',
  })
  @Get(':commentId/like-toggle')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async toggleLikeComment(
    @Param('commentId') commentId: string,
    @Req() req: any,
    @CurrentUser() { full_name, avatar_url }: User,
  ) {
    return await this.commentService.toggleLikeComment(
      +commentId,
      req.user.id,
      full_name,
      avatar_url,
    );
  }
}
