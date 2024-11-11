import { Injectable } from '@nestjs/common';
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
    return this.userRepository.find();
  }

  async updateProfile(userId: number, data: any) {
    await this.userRepository.update({ id: userId }, data);

    return new SuccessRes('Update profile successfully');
  }

  async getOtherProfile(userId: number) {
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async getNotification(userId: number) {
    return this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC', is_read: 'ASC' },
    });
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
    await this.followRepository.delete({
      follower_id: userId,
      followed_id: followId,
    });

    return new SuccessRes('Unfollow user successfully');
  }

  // get my followers
  async getMyFollowers(userId: number) {
    return this.followRepository.find({
      where: { followed_id: userId },
    });
  }

  // get my followings
  async getMyFollowings(userId: number) {
    return this.followRepository.find({
      where: { follower_id: userId },
    });
  }
}
