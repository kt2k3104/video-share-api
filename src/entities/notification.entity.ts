import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { CommonEntity } from './common.entity';
import { NotificationType } from 'src/common/enums/notification.enum';

@Entity({ name: 'notifications' })
export class Notification extends CommonEntity {
  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false })
  user_id: number;

  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: true })
  contract_id: number;

  @ApiResponseProperty({ type: Boolean })
  @Column({ type: Boolean, nullable: false })
  is_read: boolean;

  @ApiResponseProperty({ type: String })
  @Column({ type: String, nullable: false })
  content: string;

  @ApiResponseProperty({ type: String })
  @Column({ type: String, nullable: false })
  title: string;

  @ApiResponseProperty({ type: NotificationType })
  @Column({
    type: 'enum',
    enum: NotificationType,
    nullable: false,
    default: NotificationType.INFO,
  })
  type: NotificationType;

  // relation
  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
