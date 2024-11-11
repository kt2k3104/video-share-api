import { Injectable } from '@nestjs/common';
import { CommentRepository } from 'src/repositories/comment.repository';
import { CreateCommentReq } from './dto/create-comment.req';
import { SuccessRes } from 'src/common/types/response';
import { LikesCommentRepository } from 'src/repositories/likes-comment.repository';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class CommentService {
  private lastLikeCommentNotification: Record<number, number> = {}; // Lưu trữ thời điểm thông báo lần cuối cho từng người dùng

  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly likesCommentRepository: LikesCommentRepository,
    private readonly pusherService: PusherService,
  ) {}

  // get paginated comments by video id
  async getComments(video_id: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // Lấy comment với phân trang
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { video_id },
      skip: skip,
      take: limit,
      relations: ['user'],
    });

    return {
      ...new SuccessRes('Get comments successfully'),
      data: comments,
      meta: {
        totalItems: total,
        itemCount: comments.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  // create comment
  async createComment(
    video_id: number,
    user_id: number,
    createCommentReq: CreateCommentReq,
  ) {
    const newComment = this.commentRepository.create({
      video_id,
      user_id,
      content: createCommentReq.content,
      parent_id: createCommentReq.parent_id || null,
      reply_id: createCommentReq.reply_id || null,
    });

    await this.commentRepository.save(newComment);

    // Nếu comment này là comment trả lời (có parentId), tăng child_count của comment cha
    if (createCommentReq.parent_id) {
      await this.commentRepository.increment(
        { id: createCommentReq.parent_id },
        'child_count',
        1,
      );
    }

    this.pusherService.trigger(`video-${video_id}`, 'new-comment', {
      message: 'Có comment mới',
      Comment: newComment,
    });

    return {
      ...new SuccessRes('Comment video successfully'),
      data: { newComment },
    };
  }

  // delete comment
  async deleteComment(comment_id: number, user_id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: comment_id, user_id },
    });

    if (!comment) {
      return new Error('Comment not found');
    }

    await this.commentRepository.delete(comment_id);

    // Nếu comment này là comment trả lời (có parentId), giảm child_count của comment cha
    if (comment.parent_id) {
      await this.commentRepository.decrement(
        { id: comment.parent_id },
        'child_count',
        1,
      );
    }

    return new SuccessRes('Delete comment successfully');
  }

  // toggle like comment
  async toggleLikeComment(
    comment_id: number,
    user_id: number,
    full_name: string,
    avatar: string,
  ) {
    // Kiểm tra xem comment có tồn tại không
    const comment = await this.commentRepository.findOne({
      where: { id: comment_id },
    });
    if (!comment) {
      return new Error('Comment not found');
    }

    const likeComment = await this.likesCommentRepository.findOne({
      where: { id: comment_id, user_id },
    });

    if (likeComment) {
      await this.likesCommentRepository.delete(likeComment.id);

      await this.commentRepository
        .createQueryBuilder()
        .update('comment')
        .set({ likes_count: () => 'likes_count - 1' })
        .where('id = :comment_id', { comment_id })
        .execute();
      return {
        ...new SuccessRes('Unlike comment successfully'),
        data: { comment_id, user_id },
      };
    }

    await this.likesCommentRepository.save({ comment_id, user_id });

    await this.likesCommentRepository
      .createQueryBuilder()
      .update('comment')
      .set({ likes_count: () => 'likes_count + 1' })
      .where('id = :comment_id', { comment_id })
      .execute();

    const now = Date.now();
    const cooldownPeriod = 5000;

    if (
      !this.lastLikeCommentNotification[comment.id] ||
      now - this.lastLikeCommentNotification[comment.id] > cooldownPeriod
    ) {
      // Gửi thông báo và cập nhật thời gian thông báo cuối cùng
      this.pusherService.trigger(`user-${comment.id}`, 'liked-comment', {
        message: `${full_name} đã thích comment của bạn.`,
        avatar,
        Comment,
      });
      this.lastLikeCommentNotification[comment.id] = now;
    }

    return {
      ...new SuccessRes('Like comment successfully'),
      data: { comment_id, user_id },
    };
  }
}
