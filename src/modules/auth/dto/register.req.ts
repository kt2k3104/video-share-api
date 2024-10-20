import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterReq {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  full_name: string;

  @ApiProperty()
  @IsPhoneNumber('VN')
  phone_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  role: string;
}
