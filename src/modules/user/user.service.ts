import { Injectable } from '@nestjs/common';
import { SuccessRes } from 'src/common/types/response';
import { NotificationRepository } from 'src/repositories/notification.repository';
import { UserRepository } from 'src/repositories/user.repositories';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
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
}
