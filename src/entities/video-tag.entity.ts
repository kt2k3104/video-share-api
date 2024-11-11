import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Tag } from './tag.entity';
import { Video } from './video.entity';
import { Type } from 'class-transformer';

@Entity('video_tags')
export class VideoTag {
  @ApiResponseProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'int' })
  @Type(() => Number)
  id: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false })
  video_id: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false })
  tag_id: number;

  //relation
  @ManyToOne(() => Tag, (tag) => tag.videoTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @ManyToOne(() => Video, (video) => video.videoTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'video_id' })
  video: Video;
}
