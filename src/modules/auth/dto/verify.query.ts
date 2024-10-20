import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyQuery {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  user_id: number;
}
