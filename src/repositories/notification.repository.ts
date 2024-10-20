import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {
    super(
      notificationRepository.target,
      notificationRepository.manager,
      notificationRepository.queryRunner,
    );
  }
}
