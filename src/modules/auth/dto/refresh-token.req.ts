import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenReq {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
