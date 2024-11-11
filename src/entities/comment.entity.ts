import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Video } from './video.entity';
import { LikesComments } from './likes- comments.entity';

@Entity('comments')
export class Comment extends CommonEntity {
  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false })
  video_id: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false })
  user_id: number;

  @ApiResponseProperty({ type: String })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false, default: 0 })
  likes_count: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false, default: 0 })
  child_count: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: true, default: null })
  parent_id: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: true, default: null })
  reply_id: number;

  //relation
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Video, (video) => video.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @OneToMany(() => LikesComments, (likesComments) => likesComments.comment)
  likesComments: LikesComments[];
}
