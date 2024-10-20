import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { UserRepository } from 'src/repositories/user.repositories';
import { UserController } from './user.controller';
import { NotificationRepository } from 'src/repositories/notification.repository';
import { Notification } from 'src/entities/notification.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification]), CloudinaryModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, NotificationRepository],
})
export class UserModule {}
