import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiResponseProperty } from '@nestjs/swagger';
import { VideoTag } from './video-tag.entity';
import { Type } from 'class-transformer';

@Entity('tags')
export class Tag {
  @ApiResponseProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'int' })
  @Type(() => Number)
  id: number;

  @ApiResponseProperty({ type: String })
  @Column({ type: String, nullable: false, length: 255 })
  name: string;

  //relaiton
  @OneToMany(() => VideoTag, (videoTag) => videoTag.tag)
  videoTags: VideoTag[];
}
