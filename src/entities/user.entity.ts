import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiResponseProperty } from '@nestjs/swagger';
import { UserLoginInformation } from './user-login-infomations.entity';
import { Notification } from './notification.entity';
import { Follow } from './follow.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Report } from './report.entity';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';
import { Video } from './video.entity';
import { LikesComments } from './likes- comments.entity';

@Entity('users')
export class User extends CommonEntity {
  @ApiResponseProperty({ type: String })
  @Column({ nullable: false, length: 100 })
  full_name: string;

  @ApiResponseProperty({ type: String })
  @Column({ nullable: false, length: 50 })
  username: string;

  @ApiResponseProperty({ type: String })
  @Column({ nullable: false, length: 100 })
  email: string;

  @ApiResponseProperty({ type: String, deprecated: true })
  @Column({ nullable: false, length: 255, select: false })
  hash_password: string;

  @ApiResponseProperty({ type: String })
  @Column({ nullable: true, length: 225 })
  avatar_url: string;

  @ApiResponseProperty({ type: String })
  @Column({ type: 'text', nullable: true })
  bio: string;

  @ApiResponseProperty({ type: 'enum', enum: UserRole })
  @Column({ nullable: false, enum: UserRole, type: 'enum' })
  role: UserRole;

  @ApiResponseProperty({ type: 'enum', enum: UserStatus })
  @Column({
    type: 'enum',
    enum: UserStatus,
    nullable: false,
  })
  status: UserStatus;

  // Define relations
  @OneToOne(() => UserLoginInformation, (userInfo) => userInfo.user)
  userLoginInfomation: UserLoginInformation;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  follower: Follow[];

  @OneToMany(() => Follow, (follow) => follow.followed)
  followed: Follow[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => LikesComments, (likesComments) => likesComments.user)
  likesComments: LikesComments[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Like[];
}
