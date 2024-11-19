import { Injectable, NotFoundException } from '@nestjs/common';
import { SuccessRes } from 'src/common/types/response';
import { FollowRepository } from 'src/repositories/follow.repository';
import { NotificationRepository } from 'src/repositories/notification.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class UserService {
  private lastFollowNotification: Record<number, number> = {}; // Lưu trữ thời điểm thông báo lần cuối cho từng người dùng

  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly followRepository: FollowRepository,
    private readonly pusherService: PusherService,
  ) {}

  async getAllUsers() {
    const Users = await this.userRepository.find();

    return {
      ...new SuccessRes('Get all users successfully!'),
      data: { Users },
    };
  }

  async updateProfile(userId: number, data: any) {
    await this.userRepository.update({ id: userId }, data);

    return {
      ...new SuccessRes('Update profile successfully'),
      data: data,
    };
  }

  async getOtherProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return {
      ...new SuccessRes('Get profile user successfully!'),
      data: { ...user },
    };
  }

  // get user by username
  async getUserByUsername(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.videos', 'videos') // Lấy danh sách video của user
      .where('user.username = :username', { username })
      .select([
        'user.id', // Chỉ chọn các trường cần thiết từ bảng user
        'user.full_name',
        'user.username',
        'user.avatar_url',
        'user.bio',
        'videos.id', // Chọn các trường từ bảng videos
        'videos.title',
        'videos.description',
        'videos.url',
        'videos.thumbnail_url',
        'videos.likes_count',
        'videos.comments_count',
        'videos.views_count',
        'videos.created_at',
      ])
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Lấy danh sách followers (những user follow user hiện tại)
    const followers = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('follows', 'f', 'f.follower_id = user.id')
      .where('f.followed_id = :id', { id: user.id })
      .select(['user.id', 'user.username', 'user.full_name', 'user.avatar_url'])
      .getMany();

    // Lấy danh sách followings (những user mà user hiện tại đã follow)
    const followings = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('follows', 'f', 'f.followed_id = user.id')
      .where('f.follower_id = :id', { id: user.id })
      .select(['user.id', 'user.username', 'user.full_name', 'user.avatar_url'])
      .getMany();

    return {
      ...new SuccessRes('Get user by username successfully!'),
      data: {
        ...user,
        followers,
        followings,
      },
    };
  }

  async getNotification(userId: number) {
    const noti = await this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC', is_read: 'ASC' },
    });

    return {
      ...new SuccessRes('Get notification successfully!'),
      data: { noti },
    };
  }

  async setIsReadNotification(userId: number) {
    await this.notificationRepository.update(
      { user_id: userId },
      { is_read: true },
    );

    return new SuccessRes('Set is read notifications successfully');
  }

  async setIsReadNotificationWithId(userId: number, id: number) {
    await this.notificationRepository.update(
      { user_id: userId, id },
      { is_read: true },
    );

    return new SuccessRes('Set is read notification with id successfully');
  }

  // search users
  async searchUsers(keyword: string) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('user.fullname LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();

    return {
      ...new SuccessRes('Search users successfully'),
      data: users,
    };
  }

  // follow user
  async followUser(userId: number, followId: number) {
    if (userId === followId) {
      throw new NotFoundException('You cannot follow yourself');
    }
    const follow = await this.followRepository.findOne({
      where: {
        follower_id: userId,
        followed_id: followId,
      },
    });
    if (follow) {
      throw new NotFoundException('You have already followed this user');
    }
    await this.followRepository.save({
      follower_id: userId,
      followed_id: followId,
    });

    const now = Date.now();
    const cooldownPeriod = 5000;

    if (
      !this.lastFollowNotification[followId] ||
      now - this.lastFollowNotification[followId] > cooldownPeriod
    ) {
      // Gửi thông báo và cập nhật thời gian thông báo cuối cùng
      this.pusherService.trigger(`user-${followId}`, 'followed', {
        message: `User ${userId} has followed you.`,
      });
      this.lastFollowNotification[followId] = now;
    }

    return {
      ...new SuccessRes('Follow user successfully'),
      data: {
        follower_id: userId,
        followed_id: followId,
      },
    };
  }

  // unfollow user
  async unfollowUser(userId: number, followId: number) {
    const follow = await this.followRepository.findOne({
      where: {
        follower_id: userId,
        followed_id: followId,
      },
    });
    if (!follow) {
      throw new NotFoundException('You have not followed this user');
    }
    await this.followRepository.delete({
      follower_id: userId,
      followed_id: followId,
    });

    return new SuccessRes('Unfollow user successfully');
  }

  // get my followers
  async getMyFollowers(userId: number) {
    const followers = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('follows', 'f', 'f.follower_id = user.id')
      .where('f.followed_id = :id', { id: userId })
      .select(['user.id', 'user.username', 'user.full_name', 'user.avatar_url'])
      .getMany();

    return {
      ...new SuccessRes('Get my follower successfully'),
      data: {
        followers,
      },
    };
  }

  // get my followings
  async getMyFollowings(userId: number) {
    const followings = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('follows', 'f', 'f.followed_id = user.id')
      .where('f.follower_id = :id', { id: userId })
      .select(['user.id', 'user.username', 'user.full_name', 'user.avatar_url'])
      .getMany();

    return {
      ...new SuccessRes('Get my followings successfully'),
      data: {
        followings,
      },
    };
  }
}
