import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiResponseProperty } from '@nestjs/swagger';
import { UserLoginInformation } from './user-login-infomations.entity';
import { Notification } from './notification.entity';
import { Cart } from './cart.entity';
import { Address } from './address.entity';
import { PaymentMethod } from './payment-method.entity';
import { Shipping } from './shipping.entity';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';

@Entity('users')
export class User extends CommonEntity {
  @ApiResponseProperty({ type: String })
  @Column({ nullable: false, length: 100 })
  full_name: string;

  @ApiResponseProperty({ type: String })
  @Column({ nullable: false, length: 100 })
  nickname: string;

  @ApiResponseProperty({ type: String })
  @Column()
  gender: string;

  @ApiResponseProperty({ type: Date })
  @Column()
  birthday: Date;

  @ApiResponseProperty({ type: String })
  @Column({ nullable: false, length: 255 })
  email: string;

  @ApiResponseProperty({ type: String })
  @Column()
  avatar: string;

  @ApiResponseProperty({ type: String })
  @Column()
  nationality: string;

  @ApiResponseProperty({ type: String })
  @Column({ nullable: false, length: 12 })
  phone_number: string;

  @ApiResponseProperty({ type: String, deprecated: true })
  @Column({ nullable: false, length: 255, select: false })
  hash_password: string;

  @ApiResponseProperty({ type: String, deprecated: true })
  @Column({ nullable: false, length: 6, select: false })
  pin: string;

  @ApiResponseProperty({ type: String })
  @Column()
  facebook_link: string;

  @ApiResponseProperty({ type: 'enum', enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
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

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
  payment_methods: PaymentMethod[];

  @OneToMany(() => Shipping, (shipping) => shipping.user)
  shippings: Shipping[];
}
