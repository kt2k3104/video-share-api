import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Type } from 'class-transformer';

@Entity({ name: 'follows' })
export class Follow {
  @ApiResponseProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'int' })
  @Type(() => Number)
  id: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false })
  follower_id: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false })
  followed_id: number;

  @ApiResponseProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  // relation
  @ManyToOne(() => User, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followed_id' })
  followed: User;
}
