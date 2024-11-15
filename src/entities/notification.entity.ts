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
import { NotificationType } from 'src/common/enums/notification.enum';
import { Type } from 'class-transformer';

@Entity({ name: 'notifications' })
export class Notification {
  @ApiResponseProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'int' })
  @Type(() => Number)
  id: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false })
  user_id: number;

  @ApiResponseProperty({ type: NotificationType })
  @Column({
    type: 'enum',
    enum: NotificationType,
    nullable: false,
  })
  type: NotificationType;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: true })
  related_id: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: true })
  actor_id: number;

  @ApiResponseProperty({ type: Boolean })
  @Column({ type: Boolean, nullable: false })
  is_read: boolean;

  @ApiResponseProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  // relation
  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
