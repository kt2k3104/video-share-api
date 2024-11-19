import { Injectable, NotFoundException } from '@nestjs/common';
import { SuccessRes } from 'src/common/types/response';
import { Video } from 'src/entities/video.entity';
import { LikeRepository } from 'src/repositories/like.repository';
import { VideoRepository } from 'src/repositories/video.repository';
import { PusherService } from '../pusher/pusher.service';
import { FollowRepository } from 'src/repositories/follow.repository';

@Injectable()
export class VideoService {
  private lastLikeNotification: Record<number, number> = {}; // Lưu trữ thời điểm thông báo lần cuối cho từng người dùng

  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly likeRepository: LikeRepository,
    private readonly followRepository: FollowRepository,
    private readonly pusherService: PusherService,
  ) {}
  // create video
  async createVideo(video: any, full_name: string, avatar: string) {
    const videoSaved = await this.videoRepository.save(video);

    // Lấy danh sách người theo dõi userId
    const followers = await this.followRepository.find({
      where: { followed_id: video.user_id },
    });

    // Gửi thông báo cho người theo dõi
    for (const follower of followers) {
      this.pusherService.trigger(`user-${follower.follower_id}`, 'new-video', {
        message: `${full_name} đã đăng tải video mới!`,
        avatar,
        video: videoSaved,
      });
    }

    return {
      ...new SuccessRes('Upload video successfully'),
      data: { ...videoSaved },
    };
  }

  // Get paginated videos
  async getPaginatedVideos(page: number, limit: number, seed: number = 1) {
    const skip = (+page - 1) * +limit;

    // Lấy video với phân trang
    const [videos, total] = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .select([
        'video', // Lấy tất cả các trường của video
        'user.id', // Chỉ lấy id của user
        'user.avatar_url', // Chỉ lấy avatar của user
        'user.username', // Chỉ lấy username của user
      ])
      .addSelect('md5(video.id || :seed)', 'random_order') // Tạo cột ngẫu nhiên dựa trên seed
      .setParameter('seed', seed)
      .orderBy('random_order')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      ...new SuccessRes('Get video successfully'),
      data: videos,
      meta: {
        totalItems: total,
        itemCount: videos.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  // get video by id
  async getVideoById(id: number) {
    const video = await this.videoRepository.findOne({
      where: { id: id },
      relations: ['user', 'likes', 'comments'],
    });

    return {
      ...new SuccessRes('Get video successfully'),
      data: video,
    };
  }

  // get my paginated videos
  async getMyPaginatedVideos(userId: number, page: number, limit: number) {
    const skip: number = (+page - 1) * +limit;

    // Lấy video của user với phân trang
    const [videos, total] = await this.videoRepository.findAndCount({
      where: { user_id: userId },
      skip: skip,
      take: limit,
      relations: ['likes', 'comments'],
    });

    return {
      ...new SuccessRes('Get my video successfully'),
      data: videos,
      meta: {
        totalItems: total,
        itemCount: videos.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  // get video by user id
  async getVideoByUserId(userId: number) {
    const videos = await this.videoRepository.find({
      where: { user_id: userId },
      relations: ['user', 'likes', 'comments'],
    });

    return {
      ...new SuccessRes('Get video by user id successfully'),
      data: videos,
    };
  }

  // update video data
  async updateVideoData(id: number, data: any) {
    await this.videoRepository.update(id, data);

    return {
      ...new SuccessRes('Update video data successfully'),
      data: { id, ...data },
    };
  }

  // delete video
  async deleteVideo(id: number) {
    await this.videoRepository.delete(id);

    return {
      ...new SuccessRes('Delete video successfully'),
      data: { id },
    };
  }

  // toggle like video
  async toggleLikeVideo(
    videoId: number,
    userId: number,
    full_name: string,
    avatar: string,
  ) {
    // Kiểm tra xem video có tồn tại không
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['user'],
    });
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const like = await this.likeRepository.findOne({
      where: { video_id: videoId, user_id: userId },
    });

    if (like) {
      await this.likeRepository.delete(like.id);

      await this.videoRepository
        .createQueryBuilder()
        .update(Video)
        .set({ likes_count: () => 'likes_count - 1' })
        .where('id = :videoId', { videoId })
        .execute();

      return {
        ...new SuccessRes('Unlike video successfully'),
        data: { videoId, userId },
      };
    }

    await this.likeRepository.save({ video_id: videoId, user_id: userId });

    await this.videoRepository
      .createQueryBuilder()
      .update(Video)
      .set({ likes_count: () => 'likes_count + 1' })
      .where('id = :videoId', { videoId })
      .execute();

    const now = Date.now();
    const cooldownPeriod = 5000;

    if (
      !this.lastLikeNotification[video.user.id] ||
      now - this.lastLikeNotification[video.user.id] > cooldownPeriod
    ) {
      // Gửi thông báo và cập nhật thời gian thông báo cuối cùng
      this.pusherService.trigger(`user-${video.user.id}`, 'liked-video', {
        message: `${full_name} đã thích video của bạn.`,
        avatar,
        video,
      });
      this.lastLikeNotification[video.user.id] = now;
    }

    return {
      ...new SuccessRes('Like video successfully'),
      data: { videoId, userId },
    };
  }

  // search video
  async searchVideo(keyword: string) {
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .where('video.title ILIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();

    return {
      ...new SuccessRes('Search video successfully'),
      data: videos,
    };
  }
}
