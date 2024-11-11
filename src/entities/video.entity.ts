import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Report } from './report.entity';
import { VideoTag } from './video-tag.entity';
import { User } from './user.entity';

@Entity('videos')
export class Video extends CommonEntity {
  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false })
  user_id: number;

  @ApiResponseProperty({ type: String })
  @Column({ type: String, nullable: true, length: 255 })
  title: string;

  @ApiResponseProperty({ type: String })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiResponseProperty({ type: String })
  @Column({ type: String, nullable: false })
  url: string;

  @ApiResponseProperty({ type: String })
  @Column({ type: String, nullable: false })
  thumbnail_url: string;

  @ApiResponseProperty({ type: String })
  @Column({ type: String, nullable: false })
  public_id: string;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false, default: 0 })
  likes_count: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false, default: 0 })
  comments_count: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false, default: 0 })
  views_count: number;

  //relation
  @ManyToOne(() => User, (user) => user.videos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.video)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.video)
  likes: Like[];

  @OneToMany(() => Report, (report) => report.video)
  reports: Report[];

  @OneToMany(() => VideoTag, (videoTag) => videoTag.video)
  videoTags: VideoTag[];
}
