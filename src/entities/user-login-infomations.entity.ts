import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { CommonEntity } from './common.entity';

@Entity({ name: 'user_login_informations' })
export class UserLoginInformation extends CommonEntity {
  @ApiResponseProperty({ type: Number })
  @Column({ type: Number, nullable: false })
  user_id: number;

  @ApiResponseProperty({ type: String })
  @Column({ type: 'text', nullable: true })
  access_token: string;

  @ApiResponseProperty({ type: String })
  @Column({ type: 'text', nullable: true })
  refresh_token: string;

  @ApiResponseProperty({ type: String })
  @Column({ type: 'text', nullable: true })
  reset_password_token: string;

  // Define relations
  @OneToOne(() => User, (user) => user.userLoginInfomation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
